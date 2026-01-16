import { Highlight } from "@/types";

export const highlights: Highlight[] = [
    {
        id: "h0",
        // No orgId for system highlight
        titleZh: "發揮影響力，拯救台灣野生動物",
        titleEn: "Make an Impact, Save Taiwanese Wildlife",
        summaryZh:
            "加入我們保護台灣獨特生物多樣性的使命。獲取即時資金數據，並直接支持致力於拯救瀕危物種的組織。",
        summaryEn:
            "Join our mission to protect Taiwan's unique biodiversity. Access real-time funding data and directly support organizations working to save endangered species.",
        sourceUrl: "/about", // Link to about page
        publishedAt: "2024-01-01T00:00:00Z",
        curatedAt: "2025-01-01T00:00:00Z", // Future date to keep it first
        category: "milestone", // Using milestone as it's a platform milestone
        isFeatured: true,
    },
    {
        id: "h1",
        orgId: "2", // Formosan Black Bear Conservation Society
        titleZh: "玉山國家公園發現新熊跡",
        titleEn: "New Bear Sighting in Yushan National Park",
        summaryZh:
            "在塔塔加遊客中心附近發現一隻母熊和兩隻幼崽，顯示該地區族群數量有健康成長的跡象。",
        summaryEn:
            "A mother bear and two cubs were spotted near the Tataka Visitor Center, indicating a healthy population growth in the region.",
        sourceUrl: "https://www.taiwanbear.org.tw/news/1",
        publishedAt: "2024-03-10T10:00:00Z",
        curatedAt: "2024-03-12T09:00:00Z",
        category: "milestone",
        isFeatured: true,
    },
    {
        id: "h2",
        orgId: "2", // Formosan Black Bear Conservation Society
        titleZh: "年度黑熊市集圓滿成功",
        titleEn: "Annual Bear Fair Success",
        summaryZh: "超過 5,000 名遊客參加了我們的年度教育市集，提高了對減少人熊衝突的認識。",
        summaryEn:
            "Over 5,000 visitors attended our annual education fair, raising awareness about human-bear conflict mitigation.",
        sourceUrl: "https://www.taiwanbear.org.tw/news/2",
        publishedAt: "2024-02-28T14:00:00Z",
        curatedAt: "2024-03-01T10:00:00Z",
        category: "education",
        isFeatured: false,
    },
    {
        id: "h3",
        orgId: "7", // Pangolin Conservation Taiwan (formerly Leopard Cat)
        titleZh: "受傷穿山甲緊急救援",
        titleEn: "Emergency Rescue of Injured Pangolin",
        summaryZh:
            "我們的團隊成功治療了一隻在苗栗被野狗咬傷的穿山甲。牠目前恢復狀況良好。",
        summaryEn:
            "Our team successfully treated a pangolin found injured by feral dogs in Miaoli. It is currently recovering well.",
        sourceUrl: "https://example.org/news/rescue-pangolin",
        publishedAt: "2024-03-15T08:30:00Z",
        curatedAt: "2024-03-16T11:00:00Z",
        category: "rescue",
        isFeatured: true,
    },
    {
        id: "h4",
        orgId: "9", // Taiwan Cetacean Society (formerly Kuroshio)
        titleZh: "新海洋生態報告發布",
        titleEn: "New Marine Ecology Report Released",
        summaryZh: "對東海岸鯨豚觀察的詳細分析揭示了令人振奮的族群穩定趨勢。",
        summaryEn:
            "Detailed analysis of cetacean observations along the east coast reveals encouraging population stability trends.",
        sourceUrl: "https://example.org/report/2024",
        publishedAt: "2024-03-05T09:00:00Z",
        curatedAt: "2024-03-08T14:00:00Z",
        category: "policy",
        isFeatured: true,
    },
    {
        id: "h5",
        orgId: "3", // Taiwan Coastal Wetland Alliance (formerly Wilderness)
        titleZh: "濕地復育計畫啟動",
        titleEn: "Wetland Restoration Project Begins",
        summaryZh: "志工們已開始從關鍵濕地移除外來種，以恢復原生棲息地。",
        summaryEn:
            "Volunteers have started the removal of invasive species from key wetlands to restore native habitat.",
        sourceUrl: "https://example.org/news/wetland",
        publishedAt: "2024-03-20T10:00:00Z",
        curatedAt: "2024-03-21T09:00:00Z",
        category: "milestone",
        isFeatured: true,
    },
];

export const getHighlightsByOrgId = (orgId: string): Highlight[] => {
    return highlights
        .filter((h) => h.orgId === orgId)
        .sort(
            (a, b) =>
                new Date(b.curatedAt).getTime() - new Date(a.curatedAt).getTime()
        );
};

export const getFeaturedHighlights = (): Highlight[] => {
    return highlights
        .filter((h) => h.isFeatured)
        .sort(
            (a, b) =>
                new Date(b.curatedAt).getTime() - new Date(a.curatedAt).getTime()
        );
};
