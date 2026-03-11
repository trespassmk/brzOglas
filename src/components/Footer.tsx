const Footer = () => {
  const links = {
    "Popular Categories": ["Cars", "Mobiles", "Laptops", "Property", "Jobs"],
    "About Us": ["About OLX", "Careers", "Contact Us", "Blog"],
    "Help": ["Sitemap", "Terms of Use", "Privacy Policy", "FAQ"],
  };

  return (
    <footer className="border-t bg-card mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-4">
              market<span className="text-sell">place</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Buy and sell anything, from cars to phones.
            </p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-sm mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © 2026 marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
