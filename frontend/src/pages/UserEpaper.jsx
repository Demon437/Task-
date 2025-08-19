import React, { useEffect, useRef, useState } from 'react';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    || (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL))
    || 'http://localhost:5000';

export default function UserEpaper() {
    const [pages, setPages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalUrl, setModalUrl] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        loadPages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadPages() {
        const res = await fetch(`${API_BASE}/api/pages`);
        const data = await res.json();
        setPages(data.pages || []);
        setCurrentIndex(0);
    }

    function prev() {
        setCurrentIndex(i => (i > 0 ? i - 1 : i));
    }

    function next() {
        setCurrentIndex(i => (i < pages.length - 1 ? i + 1 : i));
    }

    function openModal(url) {
        setModalUrl(url);
        queueMicrotask(() => {
            if (modalRef.current && window.bootstrap) {
                const modal = window.bootstrap.Modal.getOrCreateInstance(modalRef.current);
                modal.show();
            }
        });
    }

    return (
        <div className="container-fluid py-4 px-3 px-md-4">
            <h2 className="mb-3">E‑Paper</h2>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="page-frame">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <strong>Pages:</strong> {pages.length || 0}
                            </div>
                            <div>
                                <strong>Page:</strong> {pages.length ? currentIndex + 1 : 0}/{pages.length}
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-primary btn-sm" onClick={prev} disabled={currentIndex === 0}>
                                    Prev
                                </button>
                                <button className="btn btn-outline-primary btn-sm" onClick={next} disabled={currentIndex >= pages.length - 1}>
                                    Next
                                </button>
                                {pages[currentIndex] && (
                                    <button
                                        className="btn btn-outline-success btn-sm"
                                        onClick={() => openModal(`${API_BASE}${pages[currentIndex].url}`)}
                                    >
                                        Full View
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            {pages.length ? (
                                <img
                                    className="img-fluid main-image"
                                    src={`${API_BASE}${pages[currentIndex].url}`}
                                    alt={`Page ${currentIndex + 1}`}
                                    onClick={() => openModal(`${API_BASE}${pages[currentIndex].url}`)}
                                    style={{ cursor: 'zoom-in' }}
                                />
                            ) : (
                                <div className="text-muted py-5">No pages yet.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="page-frame">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>Thumbnails</strong>
                            <span className="text-muted small">Click to open</span>
                        </div>
                        <div className="row g-2">
                            {pages.map((p, idx) => (
                                <div className="col-6 col-md-12" key={p.filename}>
                                    <img
                                        src={`${API_BASE}${p.url}`}
                                        alt={`Page ${idx + 1}`}
                                        className={`img-fluid rounded thumb ${idx === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(idx)}
                                    />
                                    <div className="small text-center mt-1">Pg {idx + 1}</div>
                                </div>
                            ))}
                            {!pages.length && <div className="text-muted">No thumbnails</div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="imageModal" tabIndex="-1" ref={modalRef}>
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Full View</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center align-items-center bg-dark">
                            {modalUrl && (
                                <img
                                    src={modalUrl}
                                    alt="Full"
                                    className="img-fluid"
                                    style={{ maxHeight: '95vh' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

