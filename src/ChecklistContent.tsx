import React from 'react';

// Types (Reused from RemodelingChecklistForm or defined here and exported)
export interface ChecklistItem {
    id: string;
    content: string;
    status: '양호' | '불량' | '보류' | '';
    note: string;
}

export interface ChecklistData {
    stepName: string;
    constructionArea: string;
    date: string;
    inspector: string;
    items: ChecklistItem[];
}

interface ChecklistContentProps {
    data: ChecklistData;
    isViewMode: boolean;
    onDataChange?: (newData: ChecklistData) => void;
    forceDesktop?: boolean; // New prop to force desktop layout for image capture
    idPrefix?: string; // Prefix to avoid name collisions between visible and hidden forms
}

export const ChecklistContent = React.forwardRef<HTMLDivElement, ChecklistContentProps>(
    ({ data, isViewMode, onDataChange, forceDesktop = false, idPrefix = '' }, ref) => {

        const handleItemChange = (id: string, field: keyof ChecklistItem, value: string) => {
            if (!onDataChange) return;
            const newItems = data.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            );
            onDataChange({ ...data, items: newItems });
        };

        const handleDeleteItem = (id: string) => {
            if (!onDataChange) return;
            const newItems = data.items.filter((item) => item.id !== id);
            onDataChange({ ...data, items: newItems });
        };

        const handleAddItem = () => {
            if (!onDataChange) return;
            const newItem: ChecklistItem = {
                id: Date.now().toString(),
                content: '',
                status: '',
                note: '',
            };
            onDataChange({ ...data, items: [...data.items, newItem] });
        };

        // SVGs for Icons
        const IconPlus = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        );
        const IconTrash = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        );



        return (
            <div ref={ref} className="bg-white">
                {/* Logo and Motto Outside */}
                <div className={`mb-4 flex items-center justify-between ${forceDesktop ? '' : 'flex-col md:flex-row gap-4 md:gap-0 print:flex-row print:justify-between print:gap-0'}`}>
                    <img src="/church_logo.png" alt="성남신광교회" className="h-10 w-auto object-contain" />
                    <img
                        src="/motto_2026.png"
                        alt="2026 표어"
                        className="h-14 w-auto object-contain mb-1 mix-blend-multiply"
                        style={{ filter: 'grayscale(100%) invert(100%) brightness(120%) contrast(150%)' }}
                    />
                </div>

                <div className={`border-2 border-gray-800 bg-white relative overflow-hidden ${forceDesktop ? 'p-8' : 'p-4 md:p-8'} print:p-0 print:border-0`}>
                    <div className="relative z-10">
                        {/* Title Section */}
                        <div className="relative mb-8 border-b-2 border-gray-800 pb-4">
                            <div className="text-center pt-2">
                                <h2 className={`font-extrabold text-gray-900 mb-2 ${forceDesktop ? 'text-3xl' : 'text-2xl md:text-3xl'}`}>리모델링 공사 단계별 체크리스트</h2>
                            </div>

                            <div className={`flex justify-center mt-6 ${forceDesktop ? 'gap-8' : 'flex-col gap-4 items-stretch px-4 md:flex-row md:gap-8 md:items-center md:px-0 print:flex-row print:gap-8 print:items-center print:px-0'}`}>
                                <div className={`flex ${forceDesktop ? 'items-center gap-2' : 'flex-col items-start gap-1 md:flex-row md:items-center md:gap-2 print:flex-row print:items-center print:gap-2'}`}>
                                    <span className="font-bold text-lg whitespace-nowrap">공사 단계:</span>
                                    {isViewMode ? (
                                        <span className="text-lg border-b border-gray-400 px-4 py-1 min-w-[200px] inline-block w-full md:w-auto">{data.stepName || '(미입력)'}</span>
                                    ) : (
                                        <input
                                            type="text"
                                            value={data.stepName}
                                            onChange={(e) => onDataChange?.({ ...data, stepName: e.target.value })}
                                            placeholder="예: 철거 공사"
                                            className="border border-gray-300 rounded px-3 py-1 text-lg w-full md:w-48 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    )}
                                </div>
                                <div className={`flex ${forceDesktop ? 'items-center gap-2' : 'flex-col items-start gap-1 md:flex-row md:items-center md:gap-2 print:flex-row print:items-center print:gap-2'}`}>
                                    <span className="font-bold text-lg whitespace-nowrap">공사 구역:</span>
                                    {isViewMode ? (
                                        <span className="text-lg border-b border-gray-400 px-4 py-1 min-w-[200px] inline-block w-full md:w-auto">{data.constructionArea || '(미입력)'}</span>
                                    ) : (
                                        <input
                                            type="text"
                                            value={data.constructionArea}
                                            onChange={(e) => onDataChange?.({ ...data, constructionArea: e.target.value })}
                                            placeholder="예: 1층 로비"
                                            className="border border-gray-300 rounded px-3 py-1 text-lg w-full md:w-48 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info Grid - Stack on mobile, Restore on Print */}
                        <div className={`grid gap-0 border border-gray-800 mb-6 ${forceDesktop ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 print:grid-cols-2'}`}>
                            <div className={`flex ${forceDesktop ? 'border-b border-gray-800' : 'flex-col md:flex-row border-b border-gray-800 print:flex-row'} print:border-b md:border-b-0 md:border-r print:border-r print:border-b-0`}>
                                <div className={`${forceDesktop ? 'w-32 border-r' : 'w-full md:w-32 border-b md:border-b-0 md:border-r print:w-32 print:border-b-0 print:border-r'} bg-gray-100 p-3 font-bold flex items-center justify-center border-gray-800 whitespace-nowrap`}>점검 일자</div>
                                <div className="flex-1 p-3">
                                    {isViewMode ? (
                                        <span>{data.date}</span>
                                    ) : (
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => onDataChange?.({ ...data, date: e.target.value })}
                                            className="w-full h-full outline-none bg-transparent min-h-[1.5rem]"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className={`flex ${forceDesktop ? 'border-l border-gray-800' : 'flex-col md:flex-row print:flex-row'} ${!forceDesktop && 'border-gray-800 print:border-l'}`}>
                                <div className={`${forceDesktop ? 'w-32 border-r' : 'w-full md:w-32 border-b md:border-b-0 md:border-r print:w-32 print:border-b-0 print:border-r'} bg-gray-100 p-3 font-bold flex items-center justify-center border-gray-800 whitespace-nowrap`}>점검자</div>
                                <div className="flex-1 p-3">
                                    {isViewMode ? (
                                        <span>{data.inspector || '(미입력)'}</span>
                                    ) : (
                                        <input
                                            type="text"
                                            value={data.inspector}
                                            onChange={(e) => onDataChange?.({ ...data, inspector: e.target.value })}
                                            placeholder="이름 입력"
                                            className="w-full h-full outline-none bg-transparent min-h-[1.5rem]"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Checklist Table - Mobile: Scrollable X, Desktop: Standard */}
                        <div className={`w-full ${forceDesktop ? '' : 'overflow-x-auto'}`}>
                            <table className="w-full border-collapse border border-gray-800 min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-800 p-2 w-12 text-center text-sm md:text-base">No.</th>
                                        <th className="border border-gray-800 p-2 text-center text-sm md:text-base">점검 항목 (Check Point)</th>
                                        <th className="border border-gray-800 p-2 w-48 text-center text-sm md:text-base">점검 결과</th>
                                        <th className="border border-gray-800 p-2 w-1/4 text-center text-sm md:text-base">비고 / 조치사항</th>
                                        {!isViewMode && <th className="border border-gray-800 p-2 w-12 print:hidden text-center text-sm md:text-base">삭제</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item, index) => (
                                        <tr key={item.id} className="text-center">
                                            <td className="border border-gray-800 p-2 text-sm md:text-base">{index + 1}</td>
                                            <td className="border border-gray-800 p-2 text-left">
                                                {isViewMode ? (
                                                    <span className="whitespace-pre-wrap text-sm md:text-base">{item.content}</span>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={item.content}
                                                        onChange={(e) => handleItemChange(item.id, 'content', e.target.value)}
                                                        placeholder="점검 내용"
                                                        className="w-full p-1 border border-gray-200 rounded focus:border-blue-500 outline-none text-sm md:text-base"
                                                    />
                                                )}
                                            </td>
                                            <td className="border border-gray-800 p-2">
                                                <div className="flex justify-center gap-1 md:gap-2 flex-wrap">
                                                    {['양호', '불량', '보류'].map((statusOption) => (
                                                        <label key={statusOption} className="flex items-center gap-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={`${idPrefix}status-${item.id}`}
                                                                value={statusOption}
                                                                checked={item.status === statusOption}
                                                                onChange={(e) => handleItemChange(item.id, 'status', e.target.value as any)}
                                                                // Don't use disabled prop in view mode to avoid graying out. Use pointer-events-none instead.
                                                                className={`accent-black scale-90 md:scale-100 ${isViewMode ? 'pointer-events-none' : ''}`}
                                                            />
                                                            <span className={`text-xs md:text-sm whitespace-nowrap ${item.status === statusOption ? 'font-extrabold text-black' : 'text-gray-600'}`}>
                                                                {statusOption}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="border border-gray-800 p-2 text-left">
                                                {isViewMode ? (
                                                    <span className="text-sm md:text-base">{item.note}</span>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={item.note}
                                                        onChange={(e) => handleItemChange(item.id, 'note', e.target.value)}
                                                        placeholder=""
                                                        className="w-full p-1 border border-gray-200 rounded focus:border-blue-500 outline-none text-xs md:text-sm"
                                                    />
                                                )}
                                            </td>
                                            {!isViewMode && (
                                                <td className="border border-gray-800 p-2 print:hidden">
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="text-red-500 hover:text-red-700 flex justify-center w-full"
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add Item Button */}
                        {!isViewMode && (
                            <button
                                onClick={handleAddItem}
                                className="w-full py-3 mt-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2 transition-colors print:hidden"
                            >
                                <IconPlus /> 항목 추가하기
                            </button>
                        )}

                        {/* Signature Section - ALWAYS Visible in Print, Conditional in View */}
                        <div className={`mt-12 flex justify-end ${isViewMode ? 'flex' : 'print:flex hidden'}`}>
                            <div className="text-right">
                                <div className="inline-block border-b border-gray-800 w-48 text-center pb-2 mb-2">
                                    (서명)
                                </div>
                                <p className="text-sm text-gray-600">위와 같이 점검하였음을 확인합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
ChecklistContent.displayName = 'ChecklistContent';
