# UniLoop: Facility Fix & Report 🏫
### Sripatum University (SPU) Campus Facility Operations & Maintenance Reporting Portal

ระบบเว็บแอปพลิเคชันแจ้งซ่อมและบริหารจัดการโครงสร้างพื้นฐาน มหาวิทยาลัยศรีปทุม (SPU) พัฒนาด้วย **Nuxt 3 (Vue 3)**, **Tailwind CSS**, **Lucide Icons** และ **Prisma ORM (SQLite)** ตามแบบ UI ครบทั้ง 5 หน้าจอ

---

## 🌟 ฟีเจอร์หลัก (Core Features)

1. **User Mobile Hub (หน้าหลักผู้ใช้งาน `/`)**:
   - ออกแบบ Mobile-First พร้อมแบนเนอร์ Campus Alert
   - ปุ่ม **Quick Report via Room QR** พร้อมกล้องจำลองสแกน QR Code เพื่อดึงชื่ออาคาร ชั้น และห้องอัตโนมัติ
   - ค้นหาห้องและปุ่มทางลัด (Bldg 11, Bldg 5, Central Library, Cafeteria)
   - แถบหมวดหมู่ปัญหา และรายการแจ้งซ่อมล่าสุด

2. **Issue Form (แบบฟอร์มแจ้งซ่อม `/report`)**:
   - รองรับ Auto-fill อาคารและห้องจาก Query Parameter หรือสแกน QR
   - ตัวเลือกหมวดหมู่แบบ **Button Chips** (Air Conditioner, Lights / Elec, Sanitary, Desk & Chair, Projector / PC, Other)
   - สลับระดับความเร่งด่วน: **Normal** (24-48h) หรือ **Urgent** (แก้ปัญหาด่วน ~30 นาที)
   - ถ่ายภาพ/อัปโหลดภาพก่อนซ่อม (Before Photo) พร้อมพรีวิวทันที
   - ตัวนับจำนวนตัวอักษรของรายละเอียดปัญหา (`0 / 500`)
   - ระบุอีเมล `@spu.ac.th` พร้อมระบบตรวจสอบความถูกต้อง

3. **My Reports & Tracking (ติดตามสถานะและช่าง `/tracking`)**:
   - แท็บคัดกรองตามสถานะ: All, In Progress, Pending, Resolved
   - **Workflow Progress Stepper** 4 ขั้นตอน: `Received` -> `Assigned` -> `Working` -> `Resolved`
   - หน้าต่างเปรียบเทียบภาพก่อนและหลังซ่อม **Before / After Comparison Modal**
   - แสดงคะแนนรีวิวความพึงพอใจ

4. **Admin & Executive Analytics Portal (`/admin`)**:
   - **4 KPI Metric Cards**: Total Reports (142), Resolution Rate (88.5%), Avg. Repair Time MTTR (3.4h), Satisfaction Score (4.7/5.0)
   - แผนภูมิแท่งความหนาแน่นปัญหาแยกตามอาคาร **Problem Hotspots by Building**
   - แผนภูมิวงแหวน **Issues by Category (Donut Chart)**
   - ตาราง **Live Ticket Management** พร้อมค้นหา กรองสถานะ และมอบหมายช่าง
   - Modal ปรับสถานะงาน พร้อมระบบอัปโหลดภาพ "After-Repair Photo" ก่อนปิดงาน (Resolved)
   - ปุ่ม Export CSV สำหรับออกรายงาน

5. **Automated Multi-Stage Email Tracking Simulator**:
   - ส่งการแจ้งเตือนตามระยะงาน (Ticket Received -> In Progress -> Repair Completed)
   - หน้าต่าง In-App Notification Toast สำหรับพรีวิวอีเมล HTML เต็มรูปแบบ

---

## 🗄️ ขั้นตอนการเข้าไปดูในฐานข้อมูล (Database Inspection Guide)

คุณสามารถเข้าไปดู ตรวจสอบ หรือแก้ไขข้อมูลใน SQLite Database ได้ 3 รูปแบบตามความสะดวก:

### วิธีที่ 1: ผ่าน In-App Database Explorer บนเว็บ (เร็วที่สุด ไม่ต้องพิมพ์คำสั่ง)
1. เปิดเบราว์เซอร์ไปที่:
   ```
   http://localhost:3000/admin/database
   ```
2. คุณจะเห็นตารางข้อมูลสดจาก SQLite ทั้งตาราง `Ticket` และ `StatusLog` สามารถดูเป็นแบบ Table View หรือ Raw JSON ได้ทันที พร้อมปุ่ม Refresh

### วิธีที่ 2: ผ่าน Prisma Studio (Visual GUI มาตรฐานของ Prisma)
1. เปิด Terminal หรือ PowerShell ในโฟลเดอร์โปรเจกต์ (`f:\Dara`)
2. รันคำสั่ง:
   ```bash
   npx prisma studio
   ```
3. เบราว์เซอร์จะเปิดหน้าต่างที่ `http://localhost:5555` อัตโนมัติ คุณสามารถดู ค้นหา เพิ่ม แก้ไข หรือลบข้อมูลในทุก Table ได้แบบ Real-time ด้วยหน้าตากราฟิกที่สวยงาม

### วิธีที่ 3: เปิดไฟล์ฐานข้อมูล SQLite โดยตรง
- ไฟล์ฐานข้อมูลถูกจัดเก็บเป็นไฟล์เดียวที่ `prisma/dev.db`
- สามารถใช้โปรแกรมภายนอก เช่น **DB Browser for SQLite** หรือติดตั้ง Extension **SQLite Viewer** ใน VS Code เพื่อเปิดดูและรันคำสั่ง SQL ได้โดยตรง

---

## 🚀 ขั้นตอนการอัปโหลดขึ้น GitHub (สำหรับ Username: aphisitgit)

ทำตามขั้นตอนด้านล่างนี้ใน Terminal เพื่อส่งโค้ดทั้งหมดขึ้น GitHub ของคุณ:

### ขั้นตอนที่ 1: ตรวจสอบและ Commit โค้ดในเครื่อง
เปิด Terminal ในโฟลเดอร์โปรเจกต์ (`f:\Dara`):
```bash
# 1. เริ่มต้น git repository (ถ้ายังไม่เคยรัน)
git init

# 2. เพิ่มไฟล์ทั้งหมดเข้าสู่ staging
git add .

# 3. Commit การเปลี่ยนแปลง
git commit -m "feat: complete UniLoop SPU facility fix and report web app (Nuxt 3)"
```

### ขั้นตอนที่ 2: สร้าง Repository บน GitHub
1. เข้าไปที่เว็บ [https://github.com/new](https://github.com/new) โดยล็อกอินด้วยบัญชี **aphisitgit**
2. ตั้งชื่อ **Repository name** เช่น:
   ```
   uniloop-spu-facility
   ```
3. เลือกระดับการเข้าถึงเป็น **Public** หรือ **Private**
4. **ไม่ต้อง** ติ๊กช่อง "Add a README file" หรือ ".gitignore"
5. กดปุ่มสีเขียว **Create repository**

### ขั้นตอนที่ 3: เชื่อมต่อและ Push โค้ดขึ้น GitHub
รันคำสั่ง 3 บรรทัดนี้ใน Terminal:
```bash
# กำหนด branch หลักเป็น main
git branch -M main

# เชื่อมต่อกับ Repository บน GitHub ของคุณ
git remote add origin https://github.com/aphisitgit/uniloop-spu-facility.git

# Push โค้ดทั้งหมดขึ้น GitHub
git push -u origin main
```

---

## 💻 วิธีเปิดใช้งานโปรเจกต์บนเครื่องใหม่ (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. ซิงค์ Database Schema
npx prisma db push

# 3. ใส่ข้อมูลเริ่มต้น (Seed Data)
npm run db:seed

# 4. รัน Dev Server
npm run dev
```

เปิดดูเว็บแอปพลิเคชันได้ที่:
- **Mobile Hub**: [http://localhost:3000/](http://localhost:3000/)
- **แบบฟอร์มแจ้งซ่อม**: [http://localhost:3000/report](http://localhost:3000/report)
- **ติดตามสถานะ**: [http://localhost:3000/tracking](http://localhost:3000/tracking)
- **Executive Analytics**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Database Explorer**: [http://localhost:3000/admin/database](http://localhost:3000/admin/database)
