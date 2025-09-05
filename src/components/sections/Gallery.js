import { useState, useRef, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './Gallery.css';

// Pin photos to the start of the gallery
const INITIAL_ORDER = [""];

function importAll(r) {
    let imported = r.keys().map(r).reverse();
    let initial = 0;
    for (let i = 0; i < imported.length; i++) {
        if (initial > INITIAL_ORDER.length) break;
        if (imported[i].includes(INITIAL_ORDER[initial])) {
            let temp = imported[i];
            imported[i] = imported[initial];
            imported[initial] = temp;
            initial++;
        }
    }
    return imported;
}

const thumbnails = importAll(require.context('../../assets/thumbnails/', false, /\.(png|jpe?g|svg|webp)$/));
const photos = importAll(require.context('../../assets/photos/', false, /\.(png|jpe?g|svg|webp)$/));

const PhotoGallery = ({ thumbnails, photos }) => {
    const [expanded, setExpanded] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dimensions, setDimensions] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    

    // Masonary grid sizing
    const [columnCount, setColumnCount] = useState(3);
    const [gapSize, setGapSize] = useState(10);

    // Image modal
    const [showModal, setShowModal] = useState(false);
    const [imgPreviewCount, setImgPreviewCount] = useState(7); // this should always be an odd number
    const [showPreviewStrip, setShowPreviewStrip] = useState(true);

    const galleryRef = useRef(null);
    const maxVisibleHeight = 960; // Max height before collapsing (in pixels)

    const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width < 512) {
            setColumnCount(1);
            setGapSize(8);

            setImgPreviewCount(3)
        } else if (width < 768) {
            setColumnCount(2);
            setGapSize(10);

            setImgPreviewCount(5)
        }else if (width < 1024) {
            setColumnCount(3);
            setGapSize(10);

            setImgPreviewCount(7)
        } else if (width < 1280){
            setColumnCount(4);
            setGapSize(16);

            setImgPreviewCount(11)
        } else {
            setColumnCount(Math.floor(width/256));
            setGapSize(20);

            setImgPreviewCount(15);
        }

        // Only show the preview strip if the height is >= 768 px
        setShowPreviewStrip(height >= 768); 
    };

    // Calculate responsive column count and gap
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Wait for all the photos to load
    useEffect(() => {
        if (!thumbnails.length) return;

        const loadImages = async () => {
            const loadedDimensions = {};

            await Promise.all(thumbnails.map(async (photo, index) => {
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
                    img.onerror = resolve;
                });
            }));

            setDimensions(loadedDimensions);
        };

        loadImages();
    }, [thumbnails]);

    useEffect(() => {
        if (Object.keys(dimensions).length === 0 || !galleryRef.current) return;

        const calculateColumns = () => {
            const galleryWidth = galleryRef.current.offsetWidth;
            const columnWidth = (galleryWidth - (gapSize * (columnCount - 1))) / columnCount;
            
            const tempColumns = Array(columnCount).fill().map(() => ({ height: 0, items: [] }));

            thumbnails.forEach((photo, index) => {
                const dim = dimensions[index] || { aspectRatio: 1 };
                // Calculate height based on column width while maintaining aspect ratio
                const itemHeight = columnWidth / dim.aspectRatio;
                
                // Find the shortest column
                const shortestColumn = tempColumns.reduce((prev, curr) => 
                    curr.height < prev.height ? curr : prev
                );
                
                shortestColumn.items.push({
                    src: photo,
                    width: columnWidth,
                    height: itemHeight,
                    index: index
                });
                shortestColumn.height += itemHeight + gapSize;
            });

            setColumns(tempColumns);
        };

        calculateColumns();
    }, [dimensions, thumbnails, columnCount, gapSize]);

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setShowModal(true);
    };

    const navigateImage = (direction) => {
        let newIndex;
        if (direction === 'prev') {
            newIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
        } else {
            newIndex = (currentImageIndex + 1) % thumbnails.length;
        }
        setCurrentImageIndex(newIndex);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const galleryHeight = columns.reduce((max, column) => 
        Math.max(max, column.height), 0
    );

    const shouldShowToggle = galleryHeight > maxVisibleHeight;
    const visibleHeight = expanded ? galleryHeight : Math.min(galleryHeight, maxVisibleHeight);

    // svg icons
    // https://www.reshot.com/free-svg-icons/item/ui-icon-set-arrows-ASCRN6EM4H/

    return (
        <div className="photo-gallery" ref={galleryRef}>
            <div 
                className={`masonry-grid ${expanded || !shouldShowToggle ? 'expanded' : ''}`} 
                style={{ 
                    height: `${visibleHeight}px`,
                    transition: 'height 0.5s ease-in-out',
                    gap: `${gapSize}px`,
                    padding: `${gapSize/2}px`,
                }}
            >
                {columns.map((column, colIndex) => (
                    <div 
                        key={`col-${colIndex}`} 
                        className="masonry-column"
                        style={{ gap: `${gapSize}px` }}
                    >
                        {column.items.map((photo, photoIndex) => (
                            <div
                                key={`photo-${colIndex}-${photoIndex}`}
                                className="photo-container prevent-select"
                                style={{
                                    width: '100%',
                                    paddingBottom: `${100 / photo.width * photo.height}%`,
                                    position: 'relative'
                                }}
                                onClick={() => handleImageClick(photo.index)}
                            >
                                <LazyLoadImage
                                    src={photo.src}
                                    effect="blur"
                                    wrapperProps={{
                                        style: { 
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            transition: "1s" 
                                        },
                                    }}
                                    alt={`Photo ${colIndex * 100 + photoIndex + 1}`}
                                    className="photo prevent-select"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

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
                            d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
            {/* Image Modal */}
            {showModal && (
                <div className="image-modal">
                    <button className="modal-close" onClick={closeModal}>
                        &times;
                    </button>
                    
                    {/* Side navigation buttons (desktop) */}
                    <button 
                        className="modal-nav modal-prev side-nav" 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigateImage('prev');
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                            <path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    
                    <button 
                        className="modal-nav modal-next side-nav" 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigateImage('next');
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-image-container">
                            {currentImageIndex >= photos.length ? (
                                <div className="image-error-placeholder">
                                    <span>Image Not Found</span>
                                </div>
                            ) : (
                                <LazyLoadImage 
                                    src={photos[currentImageIndex]} 
                                    effect="blur"
                                    wrapperProps={{
                                        style: { transition: "0.5s" },
                                    }}
                                    alt={`Full resolution ${currentImageIndex}`}
                                    className="modal-image"
                                />
                            )}
                        </div>

                        {/* Mobile navigation buttons */}
                        <div className="mobile-nav-buttons">
                            <button 
                                className="modal-nav modal-prev" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage('prev');
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                                    <path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <button 
                                className="modal-nav modal-next" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage('next');
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                    <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Image preview strip */}
                        {showPreviewStrip && (<div className="image-preview-strip">
                            {thumbnails.slice(
                                Math.max(0, currentImageIndex - Math.floor(imgPreviewCount/2)),
                                Math.min(thumbnails.length, currentImageIndex + Math.ceil(imgPreviewCount/2))
                            ).map((thumb, index) => {
                                const originalIndex = Math.max(0, currentImageIndex - Math.floor(imgPreviewCount/2)) + index;
                                return (
                                    <div 
                                        key={`preview-${originalIndex}`}
                                        className={`preview-thumb ${originalIndex === currentImageIndex ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(originalIndex);
                                        }}
                                    >
                                        <LazyLoadImage
                                            src={thumb}
                                            effect="blur"
                                            alt={`Thumbnail ${originalIndex}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>)}
                    </div>
                </div>
            )}
        </div>
    );
};

const Photos = () => {
    return (
        <div className="photos-section">
            <h1>Gallery</h1>
            <p>I enjoy taking photos...</p>
            <PhotoGallery thumbnails={thumbnails} photos={photos}/>
        </div>
    );
};

export default Photos;