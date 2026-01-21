import React, { useState, useRef, useEffect } from 'react';
import { toBlob } from 'html-to-image';
import { ChecklistContent } from './ChecklistContent';
import type { ChecklistData } from './ChecklistContent';

const RemodelingChecklistForm: React.FC = () => {
    const [data, setData] = useState<ChecklistData>(() => {
        try {
            const saved = localStorage.getItem('checklist_data');
            return saved ? JSON.parse(saved) : {
                stepName: '',
                constructionArea: '',
                date: new Date().toISOString().split('T')[0],
                inspector: '',
                items: [
                    { id: '1', content: '현장 안전 수칙 게시 여부', status: '', note: '' },
                    { id: '2', content: '작업 인원 및 복장 상태 확인', status: '', note: '' },
                ],
            };
        } catch (e) {
            console.error('Failed to load saved data:', e);
            return {
                stepName: '',
                constructionArea: '',
                date: new Date().toISOString().split('T')[0],
                inspector: '',
                items: [
                    { id: '1', content: '현장 안전 수칙 게시 여부', status: '', note: '' },
                    { id: '2', content: '작업 인원 및 복장 상태 확인', status: '', note: '' },
                ],
            };
        }
    });

    useEffect(() => {
        localStorage.setItem('checklist_data', JSON.stringify(data));
    }, [data]);

    const [isSaving, setIsSaving] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const visibleFormRef = useRef<HTMLDivElement>(null);
    const hiddenPrintRef = useRef<HTMLDivElement>(null);

    const handleDownloadImage = async () => {
        if (!hiddenPrintRef.current || isSaving) return;

        try {
            setIsSaving(true);
            // Give UI a moment to update
            await new Promise(resolve => setTimeout(resolve, 100));

            const width = 896; // Fixed A4 width
            const height = hiddenPrintRef.current.offsetHeight;

            const blob = await toBlob(hiddenPrintRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                type: 'image/jpeg',
                width: width,
                height: height,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                }
            });

            if (!blob) throw new Error('Blob generation failed');

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Sanitize filename
            const safeStepName = (data.stepName || 'form').replace(/[^a-z0-9가-힣\s_-]/gi, '').trim();
            link.download = `check_list_${safeStepName}_${data.date}.jpg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('이미지 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const IconPrinter = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
    );
    const IconDownload = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
    );

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg min-h-screen font-sans print:min-h-0 print:p-0 print:shadow-none">
            {/* Header / Controls */}
            <div className="flex justify-between items-center mb-8 print:hidden">
                <button
                    onClick={() => setIsViewMode(!isViewMode)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${isViewMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    {isViewMode ? '수정 모드로 돌아가기' : '미리보기 / 완료'}
                </button>
                <div className="space-x-4">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 inline-flex items-center gap-2"
                    >
                        <IconPrinter /> 출력하기
                    </button>
                    <button
                        onClick={handleDownloadImage}
                        disabled={isSaving}
                        className={`px-4 py-2 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded font-medium inline-flex items-center gap-2 transition-colors`}
                    >
                        <IconDownload /> {isSaving ? '저장 중...' : '이미지 저장'}
                    </button>
                </div>
            </div>

            {/* Main Form Sheet (Visible) */}
            <ChecklistContent
                ref={visibleFormRef}
                data={data}
                isViewMode={isViewMode}
                onDataChange={setData}
                idPrefix="visible-"
            />

            {/* Hidden Form Sheet (For Image Capture) */}
            {/* Positioned "fixed" off-screen to the right. This ensures it's rendered by the browser (not culled) but invisible to user. */}
            <div
                className="print:hidden"
                style={{
                    position: 'fixed',
                    left: '100vw', // Move completely off-screen to the right
                    top: 0,
                    width: '896px', // Force correct A4 width
                    minHeight: '100vh', // Ensure it has height
                    background: 'white', // Ensure background exists
                    visibility: 'visible', // Essential for capture
                    zIndex: -9999, // Ensure it's behind everything just in case
                }}
            >
                <ChecklistContent
                    ref={hiddenPrintRef}
                    data={data}
                    isViewMode={true} // Always view mode for capture
                    forceDesktop={true} // Force A4 desktop layout for image capture
                    idPrefix="hidden-"
                />
            </div>
        </div>
    );
};

export default RemodelingChecklistForm;
