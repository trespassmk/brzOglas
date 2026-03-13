
-- Create users table (profiles)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  phone TEXT,
  profile_image TEXT,
  city TEXT,
  coordinates JSONB,
  verified_badge BOOLEAN NOT NULL DEFAULT false,
  rating_avg DECIMAL NOT NULL DEFAULT 0,
  free_listings_used INTEGER NOT NULL DEFAULT 0,
  total_images_uploaded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.categories(id),
  icon_url TEXT,
  slug TEXT UNIQUE NOT NULL
);

-- Create listings table
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  title TEXT NOT NULL CHECK (char_length(title) <= 1000),
  description TEXT,
  price DECIMAL,
  currency TEXT NOT NULL DEFAULT 'MKD',
  condition TEXT CHECK (condition IN ('new', 'used', 'excellent')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'deleted')),
  city TEXT,
  coordinates JSONB,
  views_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create listing_images table
CREATE TABLE public.listing_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  buyer_id UUID NOT NULL REFERENCES public.users(id),
  seller_id UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unread_count_buyer INTEGER NOT NULL DEFAULT 0,
  unread_count_seller INTEGER NOT NULL DEFAULT 0
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID NOT NULL REFERENCES public.users(id),
  reviewed_user_id UUID NOT NULL REFERENCES public.users(id),
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.users(id),
  listing_id UUID REFERENCES public.listings(id),
  user_id UUID REFERENCES public.users(id),
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'fraud', 'inappropriate', 'sold', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Listings policies
CREATE POLICY "Active listings are viewable by everyone" ON public.listings FOR SELECT USING (status = 'active' OR auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own listings" ON public.listings FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own listings" ON public.listings FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own listings" ON public.listings FOR DELETE USING (auth.uid()::text = user_id::text);

-- Listing images policies
CREATE POLICY "Listing images are viewable by everyone" ON public.listing_images FOR SELECT USING (true);
CREATE POLICY "Users can manage own listing images" ON public.listing_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND auth.uid()::text = user_id::text)
);
CREATE POLICY "Users can update own listing images" ON public.listing_images FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND auth.uid()::text = user_id::text)
);
CREATE POLICY "Users can delete own listing images" ON public.listing_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND auth.uid()::text = user_id::text)
);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (
  auth.uid()::text = buyer_id::text OR auth.uid()::text = seller_id::text
);
CREATE POLICY "Authenticated users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
  auth.uid()::text = buyer_id::text
);
CREATE POLICY "Participants can update conversations" ON public.conversations FOR UPDATE USING (
  auth.uid()::text = buyer_id::text OR auth.uid()::text = seller_id::text
);

-- Messages policies
CREATE POLICY "Conversation participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (auth.uid()::text = buyer_id::text OR auth.uid()::text = seller_id::text))
);
CREATE POLICY "Conversation participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid()::text = sender_id::text AND
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (auth.uid()::text = buyer_id::text OR auth.uid()::text = seller_id::text))
);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid()::text = reviewer_id::text);

-- Reports policies
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid()::text = reporter_id::text);
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid()::text = reporter_id::text);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_listings_user_id ON public.listings(user_id);
CREATE INDEX idx_listings_category_id ON public.listings(category_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_city ON public.listings(city);
CREATE INDEX idx_listing_images_listing_id ON public.listing_images(listing_id);
CREATE INDEX idx_conversations_buyer_id ON public.conversations(buyer_id);
CREATE INDEX idx_conversations_seller_id ON public.conversations(seller_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_reviews_reviewed_user_id ON public.reviews(reviewed_user_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('listing-images', 'listing-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Storage policies
CREATE POLICY "Listing images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'listing-images');
CREATE POLICY "Authenticated users can upload listing images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own listing images in storage" ON storage.objects FOR UPDATE USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own listing images in storage" ON storage.objects FOR DELETE USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
