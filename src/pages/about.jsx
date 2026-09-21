import "./About.css";

function About() {
    return (
        <div className="about-page">

            {/* HERO SECTION */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <span className="about-tag">HANDCRAFTED • NATURAL • MADE WITH CARE</span>

                    <h1>
                        Made by Hand.
                        <br />
                        Made with <span>Care.</span>
                    </h1>

                    <p>
                        At Maartulya, we believe everyday products should be
                        made with care, thoughtful ingredients and a commitment
                        to quality.
                    </p>

                    <a href="#our-story" className="about-btn">
                        Discover Our Story
                    </a>
                </div>

                <div className="hero-card">
                    <div className="hero-card-icon">✦</div>
                    <h3>Crafted With Care</h3>
                    <p>
                        Handmade products created with attention to every detail.
                    </p>
                </div>
            </section>


            {/* INTRO */}
            <section className="about-intro" id="our-story">
                <div className="section-label">WHO WE ARE</div>

                <h2>
                    Everyday essentials,
                    <br />
                    made a little more thoughtfully.
                </h2>

                <p>
                    Maartulya is a handmade products brand built around a simple
                    idea — creating everyday essentials with care, quality and
                    a more thoughtful approach to ingredients.
                </p>

                <p>
                    From personal-care products to household essentials, we
                    focus on handcrafted production and careful preparation.
                    Every product is made with the intention of bringing a
                    reliable and enjoyable experience to our customers.
                </p>
            </section>


            {/* VALUES */}
            <section className="values-section">
                <div className="section-heading">
                    <div className="section-label">WHAT WE BELIEVE</div>

                    <h2>
                        More than a product.
                        <br />
                        It's the way we make it.
                    </h2>
                </div>

                <div className="values-grid">

                    <div className="value-card">
                        <div className="value-icon">✋</div>
                        <h3>Handcrafted</h3>
                        <p>
                            Our products are made with a hands-on approach,
                            giving attention to the process instead of
                            treating everything like mass-produced goods.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">🌿</div>
                        <h3>Thoughtful Ingredients</h3>
                        <p>
                            We focus on carefully selected ingredients and
                            avoid unnecessary harsh or harmful ingredients
                            wherever possible.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">✓</div>
                        <h3>Quality First</h3>
                        <p>
                            We care about consistency, preparation and the
                            overall experience our customers receive from
                            every product.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">♡</div>
                        <h3>Made With Care</h3>
                        <p>
                            Every product represents our effort to create
                            useful everyday essentials that people can feel
                            good about bringing into their homes.
                        </p>
                    </div>

                </div>
            </section>


            {/* PRODUCTS */}
            <section className="products-section">

                <div className="section-heading center">
                    <div className="section-label">WHAT WE MAKE</div>

                    <h2>
                        From personal care
                        <br />
                        to everyday essentials.
                    </h2>

                    <p>
                        Our range is growing, but our approach remains the same:
                        thoughtful making, careful preparation and quality.
                    </p>
                </div>

                <div className="product-category-grid">

                    <div className="category-card soap">
                        <div className="category-number">01</div>
                        <h3>Handmade Soaps</h3>
                        <p>
                            Carefully crafted soaps designed to make everyday
                            cleansing feel simple and refreshing.
                        </p>
                    </div>

                    <div className="category-card shampoo">
                        <div className="category-number">02</div>
                        <h3>Hair Care</h3>
                        <p>
                            Thoughtfully prepared shampoos created for a
                            comfortable and refreshing hair-care routine.
                        </p>
                    </div>

                    <div className="category-card cream">
                        <div className="category-number">03</div>
                        <h3>Face Care</h3>
                        <p>
                            Face creams and personal-care products made with
                            attention to ingredients and everyday usability.
                        </p>
                    </div>

                    <div className="category-card cleaner">
                        <div className="category-number">04</div>
                        <h3>Home Care</h3>
                        <p>
                            Practical household essentials such as floor
                            cleaners, made with the same thoughtful approach.
                        </p>
                    </div>

                </div>
            </section>


            {/* PROCESS */}
            <section className="process-section">

                <div className="process-text">
                    <div className="section-label">OUR APPROACH</div>

                    <h2>
                        From ingredients
                        <br />
                        to your home.
                    </h2>

                    <p>
                        We believe that good products start with a good
                        process. That's why we pay attention to the details
                        involved in making, preparing and presenting our
                        products.
                    </p>
                </div>

                <div className="process-list">

                    <div className="process-item">
                        <span>01</span>
                        <div>
                            <h3>Select</h3>
                            <p>
                                Ingredients and materials are selected with
                                care according to the product.
                            </p>
                        </div>
                    </div>

                    <div className="process-item">
                        <span>02</span>
                        <div>
                            <h3>Craft</h3>
                            <p>
                                Products are prepared using a hands-on
                                handcrafted approach.
                            </p>
                        </div>
                    </div>

                    <div className="process-item">
                        <span>03</span>
                        <div>
                            <h3>Check</h3>
                            <p>
                                We pay attention to consistency and the final
                                quality before products reach customers.
                            </p>
                        </div>
                    </div>

                    <div className="process-item">
                        <span>04</span>
                        <div>
                            <h3>Deliver</h3>
                            <p>
                                Finally, the finished product is prepared to
                                become part of your everyday routine.
                            </p>
                        </div>
                    </div>

                </div>
            </section>


            {/* PROMISE */}
            <section className="promise-section">

                <div className="promise-box">

                    <div className="promise-icon">✦</div>

                    <div>
                        <div className="section-label">THE MAARTULYA PROMISE</div>

                        <h2>
                            Simple products.
                            <br />
                            Thoughtful making.
                        </h2>

                        <p>
                            We are continuously working to improve our products,
                            expand our range and build a brand that customers
                            can trust for their everyday needs.
                        </p>
                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="about-cta">

                <div className="cta-content">

                    <div className="section-label">EXPLORE MAARTULYA</div>

                    <h2>
                        Made for everyday life.
                        <br />
                        Made with care.
                    </h2>

                    <p>
                        Explore our collection and discover handcrafted
                        essentials made with a thoughtful approach.
                    </p>

                    <a href="/products" className="about-btn dark">
                        Explore Products →
                    </a>

                </div>

            </section>

        </div>
    );
}

export default About;