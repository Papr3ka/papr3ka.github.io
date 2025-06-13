import { useState, useRef, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import '../PhotoGallery.css'

function importAll(r) {
    return r.keys().map(r)
}

const images = importAll(require.context('../photos', false, /\.(png|jpe?g|svg)$/))

const PhotoGallery = ({ photos }) => {
    const [expanded, setExpanded] = useState(false);
    const [rows, setRows] = useState([]);
    const [dimensions, setDimensions] = useState({});
    const galleryRef = useRef(null);
    const maxVisibleRows = 4;

    useEffect(() => {
        if (!photos.length) return;

        // Preload images and get their dimensions
        const loadImages = async () => {
            const loadedDimensions = {};

            await Promise.all(photos.map(async (photo, index) => {
                const img = new Image();
                img.src = photo;

                await new Promise((resolve) => {
                    img.onload = () => {
                        loadedDimensions[index] = {
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                            aspectRatio: img.naturalWidth / img.naturalHeight
                        };
                        resolve();
                    };
                    img.onerror = resolve; // Handle broken images
                });
            }));

            setDimensions(loadedDimensions);
        };

        loadImages();
    }, [photos]);

    useEffect(() => {
        if (Object.keys(dimensions).length === 0 || !galleryRef.current) return;

        const calculateRows = () => {
            const galleryWidth = galleryRef.current.offsetWidth;
            const marginBetweenPhotos = 10;
            const targetRowHeight = 200;
            const tempRows = [];
            let currentRow = [];
            let currentRowWidth = 0;

            photos.forEach((photo, index) => {
                const dim = dimensions[index] || { aspectRatio: 1 }; // Fallback for broken images
                const photoWidth = targetRowHeight * dim.aspectRatio;

                if (currentRowWidth + photoWidth + (currentRow.length * marginBetweenPhotos) <= galleryWidth) {
                    currentRow.push({
                        src: photo,
                        width: photoWidth,
                        height: targetRowHeight
                    });
                    currentRowWidth += photoWidth;
                } else {
                    tempRows.push(currentRow);
                    currentRow = [{
                        src: photo,
                        width: photoWidth,
                        height: targetRowHeight
                    }];
                    currentRowWidth = photoWidth;
                }

                if (index === photos.length - 1 && currentRow.length > 0) {
                    tempRows.push(currentRow);
                }
            });

            setRows(tempRows);
        };

        calculateRows();

        const handleResize = () => calculateRows();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dimensions, photos]);

    const visibleRows = expanded ? rows : rows.slice(0, maxVisibleRows + 1);
    const shouldShowToggle = rows.length > maxVisibleRows;

    return (
        <div className="photo-gallery" ref={galleryRef}>
            {visibleRows.map((row, rowIndex) => (
                <div
                    key={`row-${rowIndex}`}
                    className={`photo-row ${!expanded && rowIndex === maxVisibleRows ? 'faded-row' : ''}`}
                >
                    {row.map((photo, photoIndex) => (
                        <div
                            key={`photo-${rowIndex}-${photoIndex}`}
                            className="photo-container"
                            style={{
                                width: `${photo.width}px`,
                                height: `${photo.height}px`,
                                marginRight: photoIndex < row.length - 1 ? '10px' : '0'
                            }}
                        >
                            <LazyLoadImage
                                src={photo.src}
                                delayTime={250}
                                effect="blur"
                                wrapperProps={{
                                    style: {transitionDelay: "1s"},
                                }}
                                alt={`Photo ${rowIndex * 100 + photoIndex + 1}`}
                                className="photo"
                            />
                        </div>
                    ))}
                </div>
            ))}

            {shouldShowToggle && (
                <button
                    className="toggle-expand-btn"
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`chevron ${expanded ? 'expanded' : ''}`}
                    >
                        <path
                            d="M7 10L12 15L17 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

const Photos = () => {
    return (
        <div className="photos-section">
            <h1>Photos</h1>
            <p>
                I enjoy taking photos...
            </p>
            <PhotoGallery photos={images} />
        </div>
    )
}

export default Photos