import React, { useEffect, useRef, useState } from 'react';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    || (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL))
    || 'http://localhost:5000';

export default function AdminEpaper() {
    const [pages, setPages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [modalUrl, setModalUrl] = useState('');
    const [zoom, setZoom] = useState(1);
    const [fitWidth, setFitWidth] = useState(true);
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

    async function handleUpload(e) {
        e.preventDefault();
        if (!files.length) return;
        setIsLoading(true);
        const fd = new FormData();
        for (const f of files) fd.append('pages', f);
        await fetch(`${API_BASE}/api/pages`, { method: 'POST', body: fd });
        await loadPages();
        setFiles([]);
        setIsLoading(false);
    }

    async function handleDelete(filename) {
        if (!window.confirm('Delete this page?')) return;
        await fetch(`${API_BASE}/api/pages/${encodeURIComponent(filename)}`, { method: 'DELETE' });
        const nextIndex = Math.max(0, currentIndex - (currentIndex === pages.length - 1 ? 1 : 0));
        await loadPages();
        setCurrentIndex(nextIndex);
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

    function zoomIn() {
        setFitWidth(false);
        setZoom((z) => Math.min(2, Math.round((z + 0.25) * 100) / 100));
    }

    function zoomOut() {
        setFitWidth(false);
        setZoom((z) => Math.max(0.5, Math.round((z - 0.25) * 100) / 100));
    }

    function resetZoom() {
        setZoom(1);
        setFitWidth(true);
    }

    return (
        <div className="container-fluid py-4 px-3 px-md-4">
            <div className="viewer-toolbar card shadow-sm border-0 mb-3">
                <div className="card-body d-flex flex-wrap gap-2 align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <h4 className="mb-0">Admin E‑Paper</h4>
                        <span className="text-muted small">Pages: {pages.length || 0}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-outline-secondary btn-sm" type="button" onClick={loadPages}>
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                        <div className="vr mx-2" />
                        <button className="btn btn-outline-secondary btn-sm" onClick={zoomOut} title="Zoom out">
                            <i className="bi bi-zoom-out"></i>
                        </button>
                        <span className="small text-muted" style={{ minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
                        <button className="btn btn-outline-secondary btn-sm" onClick={zoomIn} title="Zoom in">
                            <i className="bi bi-zoom-in"></i>
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" onClick={resetZoom} title="Fit to width">
                            <i className="bi bi-aspect-ratio"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="uploader mb-4">
                <form onSubmit={handleUpload} className="row g-3 align-items-center">
                    <div className="col-md-6">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="form-control"
                            onChange={e => setFiles([...e.target.files])}
                        />
                        <small className="text-muted">Multiple pages select karein (PNG/JPG/WebP).</small>
                    </div>
                    <div className="col-md-3">
                        <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isLoading || !files.length}
                        >
                            {isLoading ? 'Uploading…' : 'Upload Pages'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="row g-4">
                <div className="col-lg-9">
                    <div className="page-frame">
                        <div className="viewer-scroll bg-dark d-flex justify-content-center align-items-start p-2 rounded">
                            {pages.length ? (
                                <img
                                    className="viewer-image"
                                    src={`${API_BASE}${pages[currentIndex].url}`}
                                    alt={`Page ${currentIndex + 1}`}
                                    onDoubleClick={() => openModal(`${API_BASE}${pages[currentIndex].url}`)}
                                    style={fitWidth ? { maxHeight: '78vh', width: 'auto', height: 'auto' } : { width: `${Math.round(zoom * 100)}%`, height: 'auto' }}
                                />
                            ) : (
                                <div className="text-muted py-5">No pages yet. Upload to get started.</div>
                            )}
                        </div>
                        {pages[currentIndex] && (
                            <div className="text-end mt-2">
                                <button className="btn btn-outline-success btn-sm" onClick={() => openModal(`${API_BASE}${pages[currentIndex].url}`)}>
                                    <i className="bi bi-arrows-fullscreen me-1"></i> Full View
                                </button>
                                <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleDelete(pages[currentIndex].filename)}>
                                    <i className="bi bi-trash me-1"></i> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-3">
                    <div className="page-frame sticky-panel">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>Thumbnails</strong>
                            <span className="text-muted small">Click to open</span>
                        </div>
                        <div className="row g-2 thumbs-panel">
                            {pages.map((p, idx) => (
                                <div className="col-6 col-md-12" key={p.filename}>
                                    <div className={`thumb-card ${idx === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(idx)}>
                                        <img
                                            src={`${API_BASE}${p.url}`}
                                            alt={`Page ${idx + 1}`}
                                            className="img-fluid rounded"
                                        />
                                        <div className="thumb-label">Pg {idx + 1}</div>
                                    </div>
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

