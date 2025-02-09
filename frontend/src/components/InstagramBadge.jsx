const InstagramBadge = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
                href="https://www.instagram.com/jouscards/"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://res.cloudinary.com/dl9xg597r/image/upload/v1739094099/insta-logo_f6luoi.webp"
                    alt="Follow us on Instagram"
                    style={{ width: '45px', height: '45px', borderRadius: '10%', filter: 'grayscale(90%)' }}
                />
            </a>
        </div>
    );
};

export default InstagramBadge;
