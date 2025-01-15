import React from 'react';

const ProductHuntBadge = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
                href="https://www.producthunt.com/products/jous/reviews?utm_source=badge-product_review&utm_medium=badge&utm_souce=badge-jous"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=627991&theme=dark"
                    alt="Leave a review on Product Hunt"
                    style={{ width: '200px' }}
                />
            </a>
        </div>
    );
};

export default ProductHuntBadge;
