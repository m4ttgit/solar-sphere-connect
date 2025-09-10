import os
from post_blog import post_article
from getpass import getpass

# Article content
title = "Essential Solar Products for Sustainable Living: A Comprehensive Guide"
excerpt = "Discover our curated selection of high-quality solar products that can help you embrace sustainable living, reduce your carbon footprint, and save on energy costs."
content = """<h2>Essential Solar Products for Sustainable Living: A Comprehensive Guide</h2>

<p>As the world increasingly embraces renewable energy, solar power stands at the forefront of sustainable living solutions. Whether you're looking to power your home, enhance security, or simply enjoy the convenience of portable solar-powered devices, our shop offers a carefully curated selection of high-quality products to meet your needs.</p>

<p>In this guide, we'll explore six essential solar products that can help you reduce your carbon footprint, save on energy costs, and embrace a more sustainable lifestyle.</p>

<h3>1. ECO-WORTHY 200 Watts Solar Panel Kit: Power Your Off-Grid Adventures</h3>

<p>For those seeking energy independence during outdoor adventures or for off-grid applications, the <a href="https://amzn.to/4eyX5t3" target="_blank" rel="noopener noreferrer sponsored">ECO-WORTHY 200 Watts Solar Panel Kit</a> offers an excellent solution. This comprehensive kit includes high-efficiency monocrystalline solar panels and a 30A PWM charge controller, making it perfect for RVs, campers, vehicles, and caravans.</p>

<p>What makes this kit stand out is its versatility and ease of installation. The monocrystalline panels provide superior efficiency even in low-light conditions, while the included charge controller ensures optimal battery charging and prevents overcharging. Whether you're a weekend camper or living off-grid, this solar panel kit provides reliable power generation for your essential devices.</p>

<h3>2. Tuffenough Solar Outdoor Lights: Enhanced Security with Eco-Friendly Illumination</h3>

<p>Home security doesn't have to come at the expense of your electricity bill. The <a href="https://amzn.to/4kkGfPJ" target="_blank" rel="noopener noreferrer sponsored">Tuffenough Solar Outdoor Lights</a> offer an impressive 2500 lumens of brightness with 210 LEDs, providing exceptional illumination for your outdoor spaces.</p>

<p>These lights feature three adjustable heads with a 270° wide-angle coverage, ensuring comprehensive security around your property. The motion sensor technology activates the lights when movement is detected, while the included remote control allows you to customize settings from a distance. With IP65 waterproof rating, these lights withstand various weather conditions, making them a reliable addition to your home security system.</p>

<h3>3. Adiding Solar Lights Outdoor: Flexible Lighting Solutions for Any Space</h3>

<p>The <a href="https://amzn.to/4kmDu0w" target="_blank" rel="noopener noreferrer sponsored">Adiding Solar Lights Outdoor</a> offer exceptional brightness with 212 LEDs and a 270° wide-angle design. What sets these lights apart is their flexibility—they come with a 16.4 ft cable that allows you to position the solar panel in optimal sunlight while placing the lights wherever you need them most.</p>

<p>These versatile lights feature three operational modes that can be controlled via the included remote, allowing you to customize your lighting experience. The motion sensor technology ensures the lights activate only when needed, conserving energy while providing security. Perfect for garages, yards, and pathways, these solar-powered lights combine convenience with eco-friendly functionality.</p>

<h3>4. Portable Rechargeable Fan: Comfort for Your Outdoor Adventures</h3>

<p>While not exclusively solar-powered, the <a href="https://amzn.to/4nzX77U" target="_blank" rel="noopener noreferrer sponsored">Portable Rechargeable Fan</a> complements any sustainable camping setup and can be charged using portable solar panels. With its impressive 20000mAh battery capacity providing up to 60 hours of operation, this 9-inch fan is perfect for camping, outdoor activities, or power outages.</p>

<p>The fan features auto oscillation for wider air distribution, four speed settings, and four timing options for customized comfort. The built-in LED light adds functionality for nighttime use, while the included remote control offers convenient operation from your tent or campsite. Its rechargeable design aligns perfectly with sustainable living principles, reducing the need for disposable batteries.</p>

<h3>5. WdtPro Solar Lights Outdoor Flood Light: Premium Illumination for Large Areas</h3>

<p>For those needing powerful outdoor lighting for larger spaces, the <a href="https://amzn.to/4nvS20q" target="_blank" rel="noopener noreferrer sponsored">WdtPro 2025 Solar Lights Outdoor Flood Light</a> delivers exceptional performance with 3500 lumens of brightness. The three-head design with upgraded glass panels provides superior light quality and durability compared to plastic alternatives.</p>

<p>These solar-powered flood lights feature sensitive motion sensors that detect movement up to 33 feet away, activating the lights only when needed. The waterproof design ensures reliable operation in all weather conditions, while the solar panel efficiently converts sunlight into stored energy. Perfect for yards, driveways, and security applications, these lights combine powerful illumination with energy efficiency.</p>

<h3>6. BLUETTI Solar Generator AC180: Reliable Power for Emergency Situations</h3>

<p>For comprehensive emergency preparedness or off-grid living, the <a href="https://amzn.to/46p1rko" target="_blank" rel="noopener noreferrer sponsored">BLUETTI Solar Generator AC180</a> provides exceptional power storage and output capabilities. With a 1152Wh LiFePO4 battery capacity and four 1800W AC outlets (with 2700W peak power), this solar generator can power most household appliances during outages or outdoor adventures.</p>

<p>What makes the BLUETTI AC180 particularly impressive is its rapid charging capability—reaching 80% capacity in just 45 minutes when connected to a power source. The unit can also be charged via solar panels (sold separately), making it a versatile addition to your sustainable energy system. Whether you're camping, experiencing a power outage, or living off-grid, this solar generator provides reliable power when you need it most.</p>

<h3>Embracing Sustainable Living Through Solar Technology</h3>

<p>Incorporating solar products into your lifestyle represents a meaningful step toward sustainable living. Beyond the environmental benefits of reducing your carbon footprint, these products offer practical advantages:</p>

<ul>
<li><strong>Energy Independence:</strong> Generate and store your own power, reducing reliance on the grid</li>
<li><strong>Cost Savings:</strong> Eliminate or reduce electricity costs for outdoor lighting and portable power</li>
<li><strong>Reliability:</strong> Maintain essential functions during power outages</li>
<li><strong>Versatility:</strong> Enjoy flexible installation without the need for complex wiring</li>
<li><strong>Durability:</strong> Most solar products are designed for outdoor use with weather-resistant features</li>
</ul>

<p>As solar technology continues to advance, these products become increasingly efficient and affordable, making sustainable living accessible to more people. Whether you're taking your first steps toward a solar-powered lifestyle or expanding your existing setup, our curated selection offers quality options to meet your needs.</p>

<p>Visit our <a href="/shop" target="_blank">shop page</a> to explore these products in detail and discover how solar technology can enhance your lifestyle while contributing to a more sustainable future.</p>

<p><em>Note: As an Amazon Associate, we earn from qualifying purchases. Product prices and availability are accurate as of the date/time indicated and are subject to change.</em></p>"""
author = "Solar Energy Expert"
read_time = "8 min read"
category = "Solar Products"
image_url = "/images/eco-worthy-panel.jpg"

def main():
    print("===== Posting Solar Products Article =====\n")
    print("This script will post a new article about solar products to the blog.")
    print("You will need to provide your login credentials.\n")
    
    # Get login credentials
    email = input("Enter your email: ")
    password = getpass("Enter your password: ")
    
    # Confirm before posting
    print("\nArticle Details:")
    print(f"Title: {title}")
    print(f"Author: {author}")
    print(f"Category: {category}")
    print(f"Read Time: {read_time}")
    
    confirm = input("\nDo you want to post this article? (y/n): ")
    if confirm.lower() == 'y':
        # Post the article
        post_article(
            title=title,
            excerpt=excerpt,
            content=content,
            author=author,
            read_time=read_time,
            category=category,
            image_url=image_url,
            email=email,
            password=password,
            published=True
        )
        print("\nArticle posting process completed.")
    else:
        print("\nArticle posting cancelled.")

if __name__ == "__main__":
    main()