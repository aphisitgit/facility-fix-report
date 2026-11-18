import { useState } from '#imports'

export type AppLang = 'th' | 'en'

export const translations = {
  th: {
    // Navigation & Common
    home: 'หน้าแรก',
    reportIssue: 'แจ้งซ่อม',
    myReports: 'รายการของฉัน',
    scanRoomQr: 'สแกน QR ประจำห้อง',
    admin: 'ผู้ดูแลระบบ',
    adminDashboard: 'แดชบอร์ดแอดมิน',
    backToHome: 'กลับหน้าหลัก',
    language: 'ภาษา',
    langTh: 'ไทย',
    langEn: 'ENG',
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    save: 'บันทึก',
    close: 'ปิด',
    edit: 'แก้ไข',
    delete: 'ลบ',
    search: 'ค้นหา',

    // Brand
    brandTitle: 'Facility Fix & Report',
    brandSubtitle: 'ระบบแจ้งซ่อมและบำรุงรักษา SPU',
    serviceHub: 'Sripatum University • ศูนย์บริการแจ้งซ่อม',
    serviceHubDesc: 'ระบบรับแจ้งซ่อมและรายงานปัญหาสิ่งอำนวยความสะดวก อาคารสถานที่ มหาวิทยาลัยศรีปทุม',

    // Hero QR
    quickReportTitle: 'แจ้งซ่อมด่วนผ่าน QR ประจำห้อง',
    quickReportSubtitle: 'สแกนสติกเกอร์บาร์โค้ดหรือ QR Code บนโต๊ะเรียน โปรเจกเตอร์ หรือประตูห้อง เพื่อระบุพิกัดอัตโนมัติ',
    openQrScanner: 'เปิดกล้องสแกน QR Code',

    // Verified Room Card
    verifiedRoomTitle: 'สแกนและยืนยันพิกัดห้องสำเร็จ',
    unscannedRoomTitle: 'ยังไม่ได้สแกนห้อง',
    changeLocation: 'เปลี่ยนพิกัด',
    locationLabel: 'สถานที่:',
    repairHistoryLabel: 'ประวัติแจ้งซ่อม:',
    reportInRoomNow: 'แจ้งปัญหาในห้องนี้ทันที',
    noIssuesInRoom: 'ไม่มีประวัติการแจ้งซ่อมค้างในห้องนี้',
    noIssuesInRoomDesc: 'อุปกรณ์และสิ่งอำนวยความสะดวกอยู่ในสภาพพร้อมใช้งาน หากพบจุดชำรุดเสียหาย สามารถกดปุ่มด้านซ้ายเพื่อแจ้งซ่อมได้ทันที!',
    itemsInRoom: 'รายการในห้องนี้',
    inProgressInRoom: 'กำลังดำเนินการ {count} รายการใน {room}',

    // Campus Highlights Bar
    statResponseTime: 'เข้าตรวจสอบใน ~30 นาที',
    statResponseDesc: 'ความเร็วในการตอบสนอง',
    statSuccessRate: 'แก้ไขเสร็จสิ้น 98%',
    statSuccessDesc: 'มาตรฐานงานซ่อมคุณภาพ',
    statTechnicians: 'ช่างเทคนิคผู้เชี่ยวชาญ',
    statTechniciansDesc: 'ฝ่ายอาคารสถานที่ประจำจุด',

    // Search & Filter
    searchPlaceholder: 'ค้นหาอาคาร, ชั้น หรือห้องเรียน...',
    suggestedBuildings: 'แนะนำ:',
    allCategories: 'หมวดหมู่ปัญหา',
    viewAllCategories: 'ดูหมวดหมู่ทั้งหมด',
    recentCampusReports: 'รายการแจ้งซ่อมล่าสุดในมหาวิทยาลัย',
    roomReportsHistory: 'ประวัติการแจ้งซ่อมของ {room}',
    viewAll: 'ดูทั้งหมด',
    viewAllBuildings: 'ดูทุกอาคาร',

    // Categories
    catAir: 'เครื่องปรับอากาศ',
    catElectric: 'ระบบไฟฟ้า/ไฟ',
    catPlumbing: 'สุขภัณฑ์/ประปา',
    catAv: 'โสตทัศน์/ห้องเรียน',
    catFurniture: 'โต๊ะ/เก้าอี้/เฟอร์นิเจอร์',
    catDoor: 'ประตู/หน้าต่าง/อาคาร',
    catOther: 'ปัญหาอื่น ๆ',

    // Announcement
    campusAnnouncement: 'ประกาศจากส่วนกลาง',
    editAnnouncement: 'แก้ไขประกาศนี้',

    // Form
    newIssueForm: 'แบบฟอร์มแจ้งซ่อม',
    formHeader: 'แจ้งปัญหา / รายงานเหตุซ่อมบำรุง',
    step1of2: 'ขั้นตอนที่ 1 จาก 2',
    estTime: 'ใช้เวลาประมาณ 1 นาที',
    locationSection: 'พิกัดอาคาร / สถานที่',
    manualLocation: 'ระบุพิกัดด้วยตนเอง',
    autoLocation: 'ตรวจพบพิกัดอัตโนมัติ',
    verifiedQrBadge: 'ยืนยันจาก QR แล้ว',
    locationSetBadge: 'ระบุพิกัดแล้ว',
    noLocationBadge: 'ยังไม่ได้ระบุพิกัด (จำเป็นต้องกรอก)',
    pleaseSpecifyLocation: 'กรุณาระบุสถานที่เกิดเหตุ',
    selectRecommendedOrType: 'เลือกห้องแนะนำ หรือพิมพ์ระบุห้องด้านล่าง',
    typeCustomLocation: 'พิมพ์พิกัดเอง',
    hideLocationPicker: 'ซ่อน',
    changeLocationBtn: 'เปลี่ยน',
    recommendedRoomsTab: 'เลือกห้องแนะนำ',
    typeLocationTab: 'พิมพ์ระบุพิกัดเอง',
    buildingLabel: 'อาคาร / ตึก (Building)',
    buildingPlaceholder: 'เช่น Building 11, อาคาร 5, หอสมุดกลาง...',
    floorLabel: 'ชั้น (Floor)',
    floorPlaceholder: 'เช่น 4, 5, G',
    roomLabel: 'ห้อง / บริเวณที่เกิดเหตุ',
    roomPlaceholder: 'เช่น Room 11-402, โถงลิฟต์...',
    confirmManualLocationBtn: 'ยืนยันพิกัดที่พิมพ์เอง',
    attachPhotoLabel: 'แนบรูปถ่ายหรือวิดีโอ',
    photoCountMax: 'สูงสุด 3 รูป (แนบแล้ว {count} รูป)',
    takePhotoBtn: 'ถ่ายภาพ',
    galleryBtn: 'คลังภาพ',
    proTipTitle: 'คำแนะนำ',
    proTipDesc: 'ถ่ายติดเลขห้องหรือสติกเกอร์บาร์โค้ด จะช่วยให้ช่างเข้าซ่อมได้เร็วขึ้น!',
    urgencySection: 'ระดับความเร่งด่วน',
    urgencyDurationLabel: 'ระยะเวลาดำเนินการ',
    urgencyNormalTitle: 'ปกติ (Normal)',
    urgencyNormalDesc: 'งานซ่อมทั่วไป (~24-48 ชม.)',
    urgencyUrgentTitle: 'เร่งด่วน (Urgent)',
    urgencyUrgentDesc: 'มีอันตราย, น้ำรั่ว, กระทบการเรียน',
    categorySection: 'หมวดหมู่ปัญหา',
    categorySectionSubtitle: 'เลือกประเภทของอุปกรณ์หรือพื้นที่',
    descSection: 'รายละเอียดปัญหา',
    descPlaceholder: 'เช่น แอร์ห้อง 11-502 มีน้ำหยดลงโต๊ะคอมแถวที่ 3 เปิดไม่ติด หรือมีเสียงสั่นดังผิดปกติตั้งแต่ช่วงเช้า',
    reporterSection: 'ข้อมูลผู้แจ้งซ่อม (สำหรับรับการแจ้งเตือน)',
    reporterEmail: 'อีเมลนักศึกษา / บุคลากร SPU',
    reporterEmailHint: 'ระบบจะส่งการแจ้งเตือนสถานะงานซ่อมไปยังอีเมลนี้โดยอัตโนมัติในทุกขั้นตอน',
    submitReportBtn: 'ส่งข้อมูลแจ้งซ่อม ▷',
    submittingBtn: 'กำลังส่งข้อมูลแจ้งซ่อม...',
    urgentReassurance: 'ทีมช่างฝ่ายอาคารและสถานที่พร้อมเข้าตรวจสอบเหตุเร่งด่วนภายใน ~30 นาที',

    // Tracking
    trackingTitle: 'ติดตามสถานะการแจ้งซ่อม',
    trackingSubtitleScanned: 'ติดตามความคืบหน้างานซ่อมแบบเรียลไทม์สำหรับ {room}',
    trackingSubtitleUnscanned: 'กรุณาสแกน QR Code ประจำห้องเพื่อดูและติดตามประวัติการซ่อมบำรุง',
    scanOtherRoomBtn: 'สแกนห้องอื่น',
    reportInThisRoomBtn: 'แจ้งปัญหาห้องนี้',
    syncedRoomLogs: 'ซิงค์กับประวัติประจำห้องอัตโนมัติ',
    scanPromptTitle: 'กรุณาสแกน QR Code ประจำห้องก่อน',
    scanPromptDesc: 'ระบบจะแสดงประวัติและสถานะการซ่อมบำรุงเฉพาะของห้องที่คุณสแกน เพื่อความแม่นยำและป้องกันการแจ้งซ้ำซ้อน',
    openCameraScannerBtn: 'เปิดกล้องสแกน QR Code ประจำห้อง',
    orSelectTestRoom: 'หรือเลือกห้องตัวอย่างเพื่อทดสอบ:',
    testRoomLabel: 'ห้องตัวอย่าง SPU',
    filterAll: 'ทั้งหมด',
    filterWorking: 'กำลังซ่อม',
    filterAssigned: 'มอบหมายแล้ว',
    filterReceived: 'รับเรื่องแล้ว',
    filterResolved: 'เสร็จสิ้น',
    workflowProgress: 'ความคืบหน้างานซ่อม',
    contactTechnician: 'ติดต่อช่าง',
    viewBeforeAfter: 'ดูภาพก่อน-หลังซ่อม',
    techPreparing: 'ช่างเตรียมเข้าพื้นที่',
    noHistoryInRoom: 'ไม่มีประวัติการแจ้งซ่อมในห้องนี้',
    noHistoryInRoomDesc: 'อุปกรณ์และสิ่งอำนวยความสะดวกใน {room} อยู่ในสภาพสมบูรณ์ พร้อมใช้งานตามปกติ',

    // Status Badges
    statusPending: 'รับเรื่องแล้ว',
    statusAssigned: 'มอบหมายแล้ว',
    statusWorking: 'กำลังซ่อม',
    statusResolved: 'เสร็จสิ้น',

    // Admin Dashboard
    adminCampusSelector: 'ศูนย์บริการส่วนกลาง (SPU)',
    adminCentralAnnouncement: 'ประกาศส่วนกลาง',
    adminExportCsv: 'ส่งออก CSV',
    adminNewOrder: 'สั่งงานช่าง',
    adminTotalTickets: 'รายการแจ้งซ่อมทั้งหมด',
    adminUrgentTickets: 'รายการเร่งด่วน',
    adminWorkingTickets: 'กำลังดำเนินการซ่อม',
    adminResolvedTickets: 'ซ่อมเสร็จสิ้นแล้ว',
    adminAvgTime: 'เวลาเฉลี่ยเข้าตรวจสอบ',
    adminBuildingDistribution: 'จุดที่พบปัญหาบ่อยตามอาคาร',
    adminBuildingDistributionDesc: 'การกระจายตัวของรายการแจ้งซ่อมบำรุงตามอาคารในมหาวิทยาลัยเดือนนี้',
    adminTicketManagement: 'รายการแจ้งซ่อมทั้งหมด (Ticket Management)',
    adminShowingRecords: 'แสดง 1 ถึง {count} จาก {total} รายการในมหาวิทยาลัยศรีปทุม',
    adminPrevPage: 'ก่อนหน้า',
    adminNextPage: 'ถัดไป',
    adminColTicket: 'Ticket ID',
    adminColLocation: 'สถานที่ / อาคาร',
    adminColCategory: 'หมวดหมู่',
    adminColUrgency: 'ความเร่งด่วน',
    adminColStatus: 'สถานะ',
    adminColReporter: 'ผู้แจ้ง',
    adminColTech: 'ช่างผู้รับผิดชอบ',
    adminColDate: 'วันที่แจ้ง',
    adminColAction: 'การจัดการ',
    adminSearchPlaceholder: 'ค้นหา Ticket ID, ห้อง, อีเมลผู้แจ้ง...',
    adminAssignToMe: 'รับงานเอง',
    adminUpdateStatus: 'อัปเดตสถานะ',
    adminZoneCount: '5 โซนพื้นที่',
    adminSatisfaction: 'ความพึงพอใจ 96% จากนักศึกษาและอาจารย์',

    // Admin Extra
    adminSubtitle: 'ศูนย์ควบคุมและสถิติการปฏิบัติงาน',
    adminLiveConnected: 'เชื่อมต่อสด • อัปเดตเมื่อสักครู่',
    adminMainTitle: 'ระบบบริหารจัดการและรายงานงานซ่อมบำรุงอาคารสถานที่',
    adminMainDesc: 'ภาพรวมการคัดกรองงานแจ้งซ่อมแบบเรียลไทม์ ประสิทธิภาพการบำรุงรักษา และสถานะสุขภาวะอาคารสถานที่ มหาวิทยาลัยศรีปทุม',
    adminMonthCurrent: 'เดือนนี้ (ต.ค. 2024)',
    adminMonthPrev: 'เดือนก่อนหน้า (ก.ย. 2024)',
    adminMonthTerm: 'ภาคเรียนที่ 1/2024 ทั้งหมด',
    adminAllBuildings: 'ทุกอาคาร',
    adminBuilding11: 'อาคาร 11 (Building 11)',
    adminBuilding9: 'อาคาร 9 (Building 9)',
    adminBuilding5: 'อาคาร 5 (Building 5)',
    adminCentralLibrary: 'หอสมุดกลาง (Central Library)',
    adminGenerateSla: 'สร้างรายงาน SLA (PDF)',
    adminTotalReportsMonth: 'รายงานทั้งหมดในเดือนนี้',
    adminResolutionRate: 'อัตราการซ่อมสำเร็จ',
    adminMttr: 'เวลาซ่อมเฉลี่ย (MTTR)',
    adminSatisfactionScore: 'คะแนนความพึงพอใจ',
    adminUrgentCases: '{count} รายการเร่งด่วน',
    adminVsLastMonth: 'เทียบกับ 127 ในเดือนก่อน',
    adminTargetSla: 'เป้าหมาย SLA: < 6 ชม.',
    adminDispatchSpeedImproved: 'ความเร็วการสั่งงานช่างดีขึ้นกว่ารอบก่อนหน้า',
    adminTriageUrgent: '⚡ คัดกรองเหตุเร่งด่วน: 48 นาที',
    adminBasedOnReviews: 'ประเมินจาก 118 ความคิดเห็น',
    adminSpuQuality: 'มาตรฐานคุณภาพ SPU',
    adminCategoryDistribution: 'สัดส่วนปัญหาตามหมวดหมู่',
    adminCategoryDistributionDesc: 'การจำแนกประเภทปัญหาและอุบัติการณ์ที่ได้รับแจ้ง',
    adminTotalItems: 'รายการทั้งหมด',
    adminViewCategoryStats: 'ดูรายละเอียดการตรวจสอบตามหมวดหมู่',
    adminLiveTicketManagement: 'จัดการรายการแจ้งซ่อมแบบเรียลไทม์',
    adminActiveTicketsToday: '{count} รายการค้างดำเนินการวันนี้',
    adminBatchAssign: 'มอบหมายงานกลุ่ม',
    adminStatusAll: 'ทุกสถานะ (4 ขั้นตอน)',
    adminStatusPendingOption: '1. รับเรื่องแล้ว (รอดำเนินการ)',
    adminStatusAssignedOption: '2. มอบหมายช่างแล้ว',
    adminStatusWorkingOption: '3. กำลังซ่อมหน้างาน',
    adminStatusResolvedOption: '4. ซ่อมเสร็จสิ้นแล้ว',
    adminTimeAll: '30 วันล่าสุด',
    adminTimeWeek: 'สัปดาห์นี้',
    adminTimeToday: 'เฉพาะวันนี้',
    adminAssignAction: 'มอบหมาย',
    adminUnassigned: 'ยังไม่ได้มอบหมาย',
    adminImageThumbnail: 'ภาพ',
    adminSlaTime: 'ระยะเวลา / SLA',
    adminAction: 'จัดการ',
    adminFloor: 'ชั้น',

    // Sidebar & Menus
    menuDashboard: 'แดชบอร์ดและสถิติ',
    menuTickets: 'จัดการงานแจ้งซ่อม',
    menuDatabase: 'จัดการฐานข้อมูล (SQL)',
    menuQrGenerator: 'สร้างสติกเกอร์ QR Code',
    menuTechnicians: 'ช่างเทคนิคและโซนพื้นที่',
    menuSettings: 'การตั้งค่า',
    menuUserPortal: 'กลับสู่หน้าผู้ใช้งานทั่วไป',
    sidebarActiveBadge: 'ค้างซ่อม',
    closeDrawer: 'ปิดแถบเมนู',
    collapseDrawer: 'ย่อแถบเมนู',

    // Tracking Extra
    pleaseScanRoomFirst: 'กรุณาสแกนห้องก่อน',
    itemsInRoomCount: '{count} รายการในห้องนี้',
    photoBefore: 'ภาพก่อนซ่อม',
    techPrefix: 'ช่าง: ',
    stepWorkflow: 'ความคืบหน้าการทำงาน',
    stepReceived: 'รับเรื่องแล้ว',
    stepAssigned: 'มอบหมายช่าง',
    stepWorking: 'กำลังซ่อม',
    stepResolved: 'เสร็จสิ้น',
    techUpdate: 'อัปเดตจากช่าง:',
    techWorkingDesc: 'กำลังดำเนินการตรวจสอบและแก้ไขปัญหาในพื้นที่',
    ratingScore: 'คะแนนประเมิน',
    photos: 'รูปถ่าย',
    estArrival: 'ประเมินเวลาเข้าตรวจ: ~30 นาที',
    viewDetails: 'ดูรายละเอียด >',
    reportIssueInRoom: 'พบปัญหา แจ้งซ่อมในห้องนี้ ▷',

    // QR Generator Page
    qrPageTitle: 'ระบบสร้างสติกเกอร์ QR Code ประจำห้องและสารบบพื้นที่',
    qrPageSubtitle: 'สร้าง ปรับแต่ง และพิมพ์สติกเกอร์ QR Code ความละเอียดสูงสำหรับติดหน้าห้องเรียนและโต๊ะปฏิบัติการ',
    qrDept: 'ฝ่ายอาคารสถานที่ SPU',
    qrBackDashboard: 'กลับหน้าหลักแดชบอร์ด',
    qrPrintCurrent: 'พิมพ์สติกเกอร์ปัจจุบัน',
    qrConfigTitle: 'กำหนดพิกัดห้องและตำแหน่ง',
    qrConfigSubtitle: 'ระบุข้อมูลอาคาร ชั้น และห้องที่ต้องการฝังลงใน QR Code นี้',
    qrLiveSyncBadge: 'ซิงค์ URL อัตโนมัติ',
    qrBuildingField: 'อาคาร / สถานที่ *',
    qrFloorField: 'ชั้น *',
    qrRoomField: 'หมายเลขห้องและชื่อห้อง / โซน *',
    qrRoomPlaceholder: 'เช่น 11-502 (ห้องแล็บมัลติมีเดีย) หรือ โซนอ่านหนังสือชั้น 3',
    qrNoteField: 'หมายเหตุระบุพิกัดเฉพาะจุด (ไม่บังคับ)',
    qrNotePlaceholder: 'เช่น ประตูทางเข้าหลัก หรือ แถวเครื่องคอมพิวเตอร์ B (โต๊ะ 10-20)',
    qrEncodedUrl: 'URL ปลายทางที่ฝังใน QR Code:',
    qrCopyUrl: 'คัดลอก URL',
    qrCopied: 'คัดลอกแล้ว!',
    qrSaveDirectory: 'บันทึกเข้าสารบบห้องประจำวิทยาเขต',
    qrTestOpen: 'ทดสอบเปิดหน้ารายงานของห้องนี้',
    qrPreviewBadge: 'ตัวอย่างสติกเกอร์ก่อนพิมพ์จริง',
    qrPreviewSizeNote: 'ขนาดมาตรฐานวิทยาเขต SPU (85 มม. x 110 มม.)',
    qrStickerScanTag: '📷 สแกนเพื่อแจ้งซ่อมหรือดูประวัติห้องนี้',
    qrStickerScanHint: 'สแกนผ่านกล้องโทรศัพท์มือถือ หรือเว็บพอร์ทัล SPU',
    qrPrintNow: 'พิมพ์สติกเกอร์ทันที',
    qrDirectoryTitle: 'สารบบห้องและพื้นที่ในวิทยาเขต',
    qrRegisteredRooms: '{count} ห้องที่ลงทะเบียนแล้ว',
    qrDirectoryDesc: 'เลือกดู ทดสอบ และสั่งพิมพ์สติกเกอร์ QR Code สำหรับห้องที่บันทึกไว้ได้อย่างรวดเร็ว',
    qrSearchPlaceholder: 'ค้นหาห้อง / อาคาร...',
    qrFilterAllBuildings: 'ทุกอาคาร',
    qrSelectAndEdit: 'เลือกและปรับแต่ง',
    qrQuickPrint: 'พิมพ์ทันที',

    // Status Modal Extra
    modalUpdateTitle: 'อัปเดตและคัดกรองสถานะงานแจ้งซ่อม',
    modalReporterLabel: 'ผู้แจ้ง:',
    modalWorkflowStandard: 'ความคืบหน้าของงาน (Workflow)',
    modalStep1: '1. รับเรื่องแล้ว',
    modalStep2: '2. มอบหมายช่าง',
    modalStep3: '3. กำลังซ่อม',
    modalStep4: '4. ซ่อมเสร็จสิ้น',
    modalAssignTechLabel: 'ช่างเทคนิคผู้รับผิดชอบ',
    modalInternalNote: 'บันทึกการทำงาน / หมายเหตุสำหรับทีมช่าง',
    modalNotifyUserTitle: 'การส่งอีเมลแจ้งเตือนผู้แจ้งซ่อม',
    modalNotifyUserDesc: 'ระบบจะส่งอีเมลอัปเดตสถานะแบบเรียลไทม์ไปยัง {email} ตามภาษาที่ผู้แจ้งเลือก',
    modalSaveBtn: 'บันทึกการอัปเดตสถานะ',
    modalAfterPhoto: 'ภาพถ่ายหลังซ่อมเสร็จสิ้น (จำเป็นสำหรับการปิดงาน)'
  },
  en: {
    // Navigation & Common
    home: 'Home',
    reportIssue: 'Report Issue',
    myReports: 'My Reports',
    scanRoomQr: 'Scan Room QR',
    admin: 'Admin',
    adminDashboard: 'Admin Dashboard',
    backToHome: 'Back to Home',
    language: 'Language',
    langTh: 'ไทย',
    langEn: 'ENG',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    close: 'Close',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',

    // Brand
    brandTitle: 'Facility Fix & Report',
    brandSubtitle: 'SPU Facilities & Infrastructure Operations',
    serviceHub: 'Sripatum University • Campus Service Hub',
    serviceHubDesc: 'Campus Facility Operations, Maintenance Triage & Infrastructure Reporting Portal',

    // Hero QR
    quickReportTitle: 'Instant Report via Room QR Code',
    quickReportSubtitle: 'Scan the barcode sticker or QR Code on your classroom desk, projector, or door to detect location automatically',
    openQrScanner: 'Open Camera to Scan QR',

    // Verified Room Card
    verifiedRoomTitle: 'Verified Room Location',
    unscannedRoomTitle: 'No Room Scanned',
    changeLocation: 'Change Location',
    locationLabel: 'Location:',
    repairHistoryLabel: 'Repair History:',
    reportInRoomNow: 'Report in this room now',
    noIssuesInRoom: 'No active repair requests in this room',
    noIssuesInRoomDesc: 'All classroom equipment and facilities are in optimal condition. If you notice any fault, click the button on the left to report!',
    itemsInRoom: 'items in this room',
    inProgressInRoom: 'In progress: {count} reports in {room}',

    // Campus Highlights Bar
    statResponseTime: 'Response in ~30 mins',
    statResponseDesc: 'Response Speed',
    statSuccessRate: '98% Resolution Rate',
    statSuccessDesc: 'Quality Standards',
    statTechnicians: 'Expert Technicians',
    statTechniciansDesc: 'On-site Facilities Team',

    // Search & Filter
    searchPlaceholder: 'Search building, floor, or room...',
    suggestedBuildings: 'Suggested:',
    allCategories: 'Issue Categories',
    viewAllCategories: 'View All Categories',
    recentCampusReports: 'Recent Campus Reports',
    roomReportsHistory: 'Repair History for {room}',
    viewAll: 'View All',
    viewAllBuildings: 'View All Buildings',

    // Categories
    catAir: 'Air Conditioning',
    catElectric: 'Electrical & Lighting',
    catPlumbing: 'Plumbing & Restroom',
    catAv: 'AV & Classroom Tech',
    catFurniture: 'Desk & Furniture',
    catDoor: 'Door & Window',
    catOther: 'Other Issues',

    // Announcement
    campusAnnouncement: 'Campus Announcement',
    editAnnouncement: 'Edit Announcement',

    // Form
    newIssueForm: 'New Issue Form',
    formHeader: 'Report Facility Issue / Incident',
    step1of2: 'Step 1 of 2',
    estTime: 'Takes ~1 minute',
    locationSection: 'Building & Location Details',
    manualLocation: 'Custom Location',
    autoLocation: 'Auto Detected',
    verifiedQrBadge: 'Verified by QR',
    locationSetBadge: 'Location Set',
    noLocationBadge: 'No Location Set (Required)',
    pleaseSpecifyLocation: 'Please specify incident location',
    selectRecommendedOrType: 'Choose recommended room or type below',
    typeCustomLocation: 'Type Location',
    hideLocationPicker: 'Hide',
    changeLocationBtn: 'Change',
    recommendedRoomsTab: 'Recommended Rooms',
    typeLocationTab: 'Type Custom Location',
    buildingLabel: 'Building / Facility',
    buildingPlaceholder: 'e.g. Building 11, Building 5, Central Library...',
    floorLabel: 'Floor Level',
    floorPlaceholder: 'e.g. 4, 5, G',
    roomLabel: 'Room / Incident Area',
    roomPlaceholder: 'e.g. Room 11-402, Elevator Hall...',
    confirmManualLocationBtn: 'Confirm Custom Location',
    attachPhotoLabel: 'Attach Photos or Video',
    photoCountMax: 'Up to 3 photos ({count} attached)',
    takePhotoBtn: 'Take Photo',
    galleryBtn: 'Photo Gallery',
    proTipTitle: 'Helpful Tip',
    proTipDesc: 'Photographing room numbers or barcode stickers helps technicians respond faster!',
    urgencySection: 'Urgency Level',
    urgencyDurationLabel: 'Response Target',
    urgencyNormalTitle: 'Normal',
    urgencyNormalDesc: 'Standard repair queue (~24-48 hrs)',
    urgencyUrgentTitle: 'Urgent!',
    urgencyUrgentDesc: 'Hazard, water leak, class disruption',
    categorySection: 'Problem Category',
    categorySectionSubtitle: 'Select type of equipment or area',
    descSection: 'Issue Description',
    descPlaceholder: 'e.g. Room 11-502 AC is leaking water onto PC desks row 3, power outlet not working or shaking noise since morning',
    reporterSection: 'Reporter Information (For Status Updates)',
    reporterEmail: 'SPU Student / Staff Email',
    reporterEmailHint: 'Live status milestones will be sent to this email automatically at each step',
    submitReportBtn: 'Submit Maintenance Report ▷',
    submittingBtn: 'Submitting report...',
    urgentReassurance: 'Facility technicians are on-site and ready to inspect urgent cases within ~30 mins',

    // Tracking
    trackingTitle: 'My Reports & Tracking',
    trackingSubtitleScanned: 'Real-time repair milestone tracker for {room}',
    trackingSubtitleUnscanned: 'Please scan classroom QR code to view and track room maintenance history',
    scanOtherRoomBtn: 'Scan Other Room',
    reportInThisRoomBtn: 'Report in This Room',
    syncedRoomLogs: 'Auto-synced with room logs',
    scanPromptTitle: 'Please scan classroom QR code first',
    scanPromptDesc: 'The system displays maintenance history specifically for your scanned room for maximum precision and to prevent duplicate reports',
    openCameraScannerBtn: 'Open Camera to Scan Room QR',
    orSelectTestRoom: 'Or select a test room for demo:',
    testRoomLabel: 'SPU Demo Rooms',
    filterAll: 'All',
    filterWorking: 'Working',
    filterAssigned: 'Assigned',
    filterReceived: 'Received',
    filterResolved: 'Resolved',
    workflowProgress: 'Workflow Progress',
    contactTechnician: 'Contact Tech',
    viewBeforeAfter: 'Before & After Photos',
    techPreparing: 'Tech dispatching',
    noHistoryInRoom: 'No active repair requests in this room',
    noHistoryInRoomDesc: 'All classroom equipment and facilities in {room} are in optimal working condition',

    // Status Badges
    statusPending: 'Received',
    statusAssigned: 'Assigned',
    statusWorking: 'Working',
    statusResolved: 'Resolved',

    // Admin Dashboard
    adminCampusSelector: 'Central Operations Hub (SPU)',
    adminCentralAnnouncement: 'Campus Announcement',
    adminExportCsv: 'Export CSV',
    adminNewOrder: 'New Work Order',
    adminTotalTickets: 'Total Tickets',
    adminUrgentTickets: 'Urgent Incidents',
    adminWorkingTickets: 'In Progress Work',
    adminResolvedTickets: 'Resolved Tickets',
    adminAvgTime: 'Avg Response Time',
    adminBuildingDistribution: 'Building Incident Distribution',
    adminBuildingDistributionDesc: 'Campus maintenance request distribution across university facilities this month',
    adminTicketManagement: 'Ticket Management',
    adminShowingRecords: 'Showing 1 to {count} of {total} records in Sripatum University',
    adminPrevPage: 'Previous',
    adminNextPage: 'Next',
    adminColTicket: 'Ticket ID',
    adminColLocation: 'Location',
    adminColCategory: 'Category',
    adminColUrgency: 'Urgency',
    adminColStatus: 'Status',
    adminColReporter: 'Reporter',
    adminColTech: 'Assigned Tech',
    adminColDate: 'Date',
    adminColAction: 'Action',
    adminSearchPlaceholder: 'Search ticket ID, room, reporter email...',
    adminAssignToMe: 'Assign to Me',
    adminUpdateStatus: 'Update Status',
    adminZoneCount: '5 Campus Zones',
    adminSatisfaction: '96% satisfaction from students & faculty',

    // Admin Extra
    adminSubtitle: 'Operations & Analytics Command Center',
    adminLiveConnected: 'Live Connected • Just updated',
    adminMainTitle: 'Campus Facility Operations & Maintenance Management System',
    adminMainDesc: 'Real-time incident triage overview, maintenance performance and facility health metrics at Sripatum University',
    adminMonthCurrent: 'This Month (Oct 2024)',
    adminMonthPrev: 'Last Month (Sep 2024)',
    adminMonthTerm: 'All Semester 1/2024',
    adminAllBuildings: 'All Buildings',
    adminBuilding11: 'Building 11',
    adminBuilding9: 'Building 9',
    adminBuilding5: 'Building 5',
    adminCentralLibrary: 'Central Library',
    adminGenerateSla: 'Generate SLA Report (PDF)',
    adminTotalReportsMonth: 'Total Reports This Month',
    adminResolutionRate: 'Resolution Rate',
    adminMttr: 'Avg. Repair Time (MTTR)',
    adminSatisfactionScore: 'Satisfaction Score',
    adminUrgentCases: '{count} Urgent Incidents',
    adminVsLastMonth: 'vs 127 last month',
    adminTargetSla: 'SLA Target: < 6 hrs',
    adminDispatchSpeedImproved: 'Dispatch speed improved vs previous cycle',
    adminTriageUrgent: '⚡ Urgent Triage: 48 mins',
    adminBasedOnReviews: 'Based on 118 reviews',
    adminSpuQuality: 'SPU Quality Standards',
    adminCategoryDistribution: 'Issues by Category',
    adminCategoryDistributionDesc: 'Breakdown of reported issues and incidents',
    adminTotalItems: 'Total Items',
    adminViewCategoryStats: 'View Category Inspection Details',
    adminLiveTicketManagement: 'Real-Time Ticket Management',
    adminActiveTicketsToday: '{count} Active Requests Today',
    adminBatchAssign: 'Batch Assign',
    adminStatusAll: 'All Statuses (4 Steps)',
    adminStatusPendingOption: '1. Received (Pending)',
    adminStatusAssignedOption: '2. Assigned to Tech',
    adminStatusWorkingOption: '3. In Progress (On-site)',
    adminStatusResolvedOption: '4. Resolved',
    adminTimeAll: 'Last 30 Days',
    adminTimeWeek: 'This Week',
    adminTimeToday: 'Today Only',
    adminAssignAction: 'Assign',
    adminUnassigned: 'Unassigned',
    adminImageThumbnail: 'Image',
    adminSlaTime: 'Elapsed / SLA',
    adminAction: 'Action',
    adminFloor: 'Floor',

    // Sidebar & Menus
    menuDashboard: 'Dashboard & Analytics',
    menuTickets: 'Ticket Management',
    menuDatabase: 'Database Explorer (SQL)',
    menuQrGenerator: 'Room QR Generator',
    menuTechnicians: 'Technicians & Zones',
    menuSettings: 'Settings',
    menuUserPortal: 'Go to User Portal',
    sidebarActiveBadge: 'Active',
    closeDrawer: 'Close Drawer',
    collapseDrawer: 'Collapse Drawer',

    // Tracking Extra
    pleaseScanRoomFirst: 'Please scan room first',
    itemsInRoomCount: '{count} items in this room',
    photoBefore: 'Before Photo',
    techPrefix: 'Tech: ',
    stepWorkflow: 'Workflow Progress',
    stepReceived: 'Received',
    stepAssigned: 'Assigned',
    stepWorking: 'Working',
    stepResolved: 'Resolved',
    techUpdate: 'Tech Update:',
    techWorkingDesc: 'Currently inspecting and resolving issue on-site',
    ratingScore: 'Rating',
    photos: 'Photos',
    estArrival: 'Est. arrival: ~30 mins',
    viewDetails: 'View Details >',
    reportIssueInRoom: 'Found an issue? Report here ▷',

    // QR Generator Page
    qrPageTitle: 'Room QR Sticker Generator & Campus Directory',
    qrPageSubtitle: 'Create, customize, and print high-resolution room QR stickers for doors & desks',
    qrDept: 'SPU Facilities Operations',
    qrBackDashboard: 'Back to Dashboard',
    qrPrintCurrent: 'Print Current Sticker',
    qrConfigTitle: 'Specify Room Coordinates & Location',
    qrConfigSubtitle: 'Specify building, floor, and room info to embed into this QR Code',
    qrLiveSyncBadge: 'Auto-Sync URL',
    qrBuildingField: 'Building / Facility *',
    qrFloorField: 'Floor *',
    qrRoomField: 'Room Number & Name / Zone *',
    qrRoomPlaceholder: 'e.g. 11-502 (Multimedia Lab) or 3rd Floor Quiet Zone',
    qrNoteField: 'Specific Sub-location Note (Optional)',
    qrNotePlaceholder: 'e.g. Door Entrance & Desk Area or PC Workstation Row B (Desks 10-20)',
    qrEncodedUrl: 'Target URL Encoded in QR Code:',
    qrCopyUrl: 'Copy URL',
    qrCopied: 'Copied!',
    qrSaveDirectory: 'Save to Campus Directory',
    qrTestOpen: 'Test Open Room Hub',
    qrPreviewBadge: 'Live Sticker Print Preview',
    qrPreviewSizeNote: 'SPU Standard Size (85 mm x 110 mm)',
    qrStickerScanTag: '📷 Scan to report issue or view room history',
    qrStickerScanHint: 'Scan with phone camera or SPU Web Portal',
    qrPrintNow: 'Print Sticker Now',
    qrDirectoryTitle: 'Campus Room & Zone Directory',
    qrRegisteredRooms: '{count} Registered Rooms',
    qrDirectoryDesc: 'Quickly browse, verify, and print QR stickers for saved campus locations',
    qrSearchPlaceholder: 'Search room / building...',
    qrFilterAllBuildings: 'All Buildings',
    qrSelectAndEdit: 'Select & Customize',
    qrQuickPrint: 'Print Now',

    // Status Modal Extra
    modalUpdateTitle: 'Update & Triage Ticket Status',
    modalReporterLabel: 'Reporter:',
    modalWorkflowStandard: 'Workflow Progress',
    modalStep1: '1. Received',
    modalStep2: '2. Assigned',
    modalStep3: '3. Working',
    modalStep4: '4. Resolved',
    modalAssignTechLabel: 'Assigned Technician',
    modalInternalNote: 'Work Notes / Team Log',
    modalNotifyUserTitle: 'Email Notification to Reporter',
    modalNotifyUserDesc: 'Live milestone updates will be sent to {email} in their preferred language',
    modalSaveBtn: 'Save Status Update',
    modalAfterPhoto: 'After Repair Photo (Required to resolve)'
  }
}

export function useAppLang() {
  const currentLang = useState<AppLang>('spu_app_lang', () => 'th')

  function initLang() {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('spu_app_lang') as AppLang
      if (saved === 'th' || saved === 'en') {
        currentLang.value = saved
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  function setLang(lang: AppLang) {
    currentLang.value = lang
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('spu_app_lang', lang)
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  function toggleLang() {
    setLang(currentLang.value === 'th' ? 'en' : 'th')
  }

  function t(key: keyof typeof translations['th'], params?: Record<string, string | number>) {
    const dict = translations[currentLang.value] || translations['th']
    let text = dict[key] || translations['th'][key] || key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      }
    }
    return text
  }

  function translateBuilding(bldg?: string): string {
    if (!bldg) return ''
    const isEn = currentLang.value === 'en'
    const lower = bldg.toLowerCase().trim()
    if (lower.includes('11') || lower.includes('multimedia')) {
      return isEn ? 'Building 11' : 'อาคาร 11'
    }
    if (lower.includes('5') || lower.includes('comm art') || lower.includes('นิเทศ')) {
      return isEn ? 'Building 5' : 'อาคาร 5'
    }
    if (lower.includes('9') || lower.includes('eng') || lower.includes('วิศว')) {
      return isEn ? 'Building 9' : 'อาคาร 9'
    }
    if (lower.includes('1') || lower.includes('อธิการ')) {
      return isEn ? 'Building 1' : 'อาคาร 1'
    }
    if (lower.includes('lib') || lower.includes('สมุด')) {
      return isEn ? 'Central Library' : 'หอสมุดกลาง'
    }
    if (lower.includes('cafe') || lower.includes('food') || lower.includes('อาหาร')) {
      return isEn ? 'Cafeteria' : 'โรงอาหาร'
    }
    if (lower.includes('sport') || lower.includes('gym') || lower.includes('กีฬา')) {
      return isEn ? 'Sports Complex' : 'ศูนย์กีฬา'
    }
    return bldg
  }

  function translateFloor(floor?: string | number): string {
    if (floor === undefined || floor === null || floor === '') return ''
    const isEn = currentLang.value === 'en'
    const clean = String(floor).replace(/^(floor|ชั้น)\s*/i, '').trim()
    if (clean.toLowerCase() === 'g') {
      return isEn ? 'Ground Floor (G)' : 'ชั้น G'
    }
    return isEn ? `Floor ${clean}` : `ชั้น ${clean}`
  }

  function translateCategory(cat?: string): string {
    if (!cat) return ''
    const lower = cat.toLowerCase()
    if (lower.includes('air') || lower.includes('แอร์') || lower.includes('ปรับอากาศ')) return t('catAir')
    if (lower.includes('light') || lower.includes('elec') || lower.includes('ไฟ')) return t('catElectric')
    if (lower.includes('sanitary') || lower.includes('plumb') || lower.includes('สุขภัณฑ์') || lower.includes('ประปา') || lower.includes('ห้องน้ำ')) return t('catPlumbing')
    if (lower.includes('av') || lower.includes('screen') || lower.includes('project') || lower.includes('โสต') || lower.includes('โปรเจก')) return t('catAv')
    if (lower.includes('furniture') || lower.includes('desk') || lower.includes('chair') || lower.includes('โต๊ะ') || lower.includes('เก้าอี้')) return t('catFurniture')
    if (lower.includes('door') || lower.includes('window') || lower.includes('ประตู') || lower.includes('หน้าต่าง') || lower.includes('อาคาร')) return t('catDoor')
    if (lower.includes('other') || lower.includes('อื่น')) return t('catOther')
    return cat
  }

  function translateUrgency(urgency?: string): string {
    if (!urgency) return ''
    const isEn = currentLang.value === 'en'
    const lower = urgency.toLowerCase()
    if (lower.includes('urgent') || lower.includes('ด่วน')) {
      return isEn ? 'Urgent' : 'เร่งด่วน'
    }
    return isEn ? 'Normal' : 'ปกติ'
  }

  function translateStatus(status?: string): string {
    if (!status) return ''
    const s = status.toUpperCase()
    if (s === 'PENDING') return t('statusPending')
    if (s === 'ASSIGNED') return t('statusAssigned')
    if (s === 'IN_PROGRESS') return t('statusWorking')
    if (s === 'RESOLVED') return t('statusResolved')
    return status
  }

  function translateRoom(room?: string): string {
    if (!room) return ''
    const isEn = currentLang.value === 'en'
    const lower = room.toLowerCase()
    if (lower.includes('11-502')) {
      return isEn ? '11-502 (Multimedia Lab)' : '11-502 (ห้องแล็บมัลติมีเดีย)'
    }
    if (lower.includes('11-401')) {
      return isEn ? '11-401 (Computer Center)' : '11-401 (ศูนย์คอมพิวเตอร์)'
    }
    if (lower.includes('5-301')) {
      return isEn ? '5-301 (Smart Seminar Hall)' : '5-301 (ห้องสัมมนาอัจฉริยะ)'
    }
    if (lower.includes('5-204')) {
      return isEn ? '5-204 (Comm Arts Studio)' : '5-204 (สตูดิโอนิเทศศาสตร์)'
    }
    if (lower.includes('9-401')) {
      return isEn ? 'Lab 9-401 (Robotics Lab)' : 'Lab 9-401 (ห้องปฏิบัติการหุ่นยนต์)'
    }
    if (lower.includes('9-203')) {
      return isEn ? '9-203 (Engineering Lecture)' : '9-203 (ห้องบรรยายวิศวกรรม)'
    }
    if (lower.includes('quiet') || lower.includes('เงียบ')) {
      return isEn ? '3rd Floor Quiet Zone' : 'โซนอ่านหนังสือเงียบ ชั้น 3'
    }
    if (lower.includes('reading') || lower.includes('โถงอ่าน')) {
      return isEn ? 'Ground Floor Reading Hall' : 'โถงอ่านหนังสือชั้น 1'
    }
    if (lower.includes('dining') || lower.includes('commons') || lower.includes('อาหาร')) {
      return isEn ? 'Main Dining Commons' : 'ศูนย์อาหารกลาง'
    }
    return room
  }

  function translateNote(note?: string): string {
    if (!note) return ''
    const isEn = currentLang.value === 'en'
    const lower = note.toLowerCase()
    if (lower.includes('ticket received') || lower.includes('ได้รับรายงาน') || lower.includes('queued for triage')) {
      return isEn ? 'Ticket received and queued for triage.' : 'ระบบได้รับรายงานแจ้งซ่อมเรียบร้อยแล้ว อยู่ระหว่างจัดสรรช่าง'
    }
    if (lower.includes('working') || lower.includes('on-site') || lower.includes('ซ่อมหน้างาน')) {
      return isEn ? 'Technician is actively working on-site.' : 'ช่างกำลังดำเนินการซ่อมแซมแก้ไขปัญหาในพื้นที่'
    }
    if (lower.includes('completed') || lower.includes('verified') || lower.includes('เสร็จสิ้น') || lower.includes('เรียบร้อย')) {
      return isEn ? 'Repairs completed and verified.' : 'ดำเนินการซ่อมแซมและตรวจสอบความเรียบร้อยแล้ว'
    }
    if (lower.includes('assigned') || lower.includes('dispatched') || lower.includes('มอบหมาย')) {
      return isEn ? 'Technician assigned and dispatched.' : 'มอบหมายงานและทีมช่างเตรียมความพร้อมเข้าตรวจสอบ'
    }
    return note
  }

  function translateStep(step?: string): string {
    if (!step) return ''
    const lower = step.toLowerCase()
    if (lower.includes('receiv') || lower.includes('รับ')) return t('stepReceived')
    if (lower.includes('assign') || lower.includes('มอบหมาย')) return t('stepAssigned')
    if (lower.includes('work') || lower.includes('progress') || lower.includes('ซ่อม')) return t('stepWorking')
    if (lower.includes('resolv') || lower.includes('complet') || lower.includes('เสร็จ')) return t('stepResolved')
    return step
  }

  return {
    currentLang,
    initLang,
    setLang,
    toggleLang,
    t,
    translateBuilding,
    translateFloor,
    translateCategory,
    translateUrgency,
    translateStatus,
    translateRoom,
    translateNote,
    translateStep,
    translations
  }
}
