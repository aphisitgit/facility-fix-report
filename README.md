# Facility Fix & Report 🏫
### Sripatum University (SPU) Campus Facility Operations & Maintenance Reporting Portal

ระบบเว็บแอปพลิเคชันแจ้งซ่อมและบริหารจัดการโครงสร้างพื้นฐาน มหาวิทยาลัยศรีปทุม (SPU) พัฒนาด้วย **Nuxt 3 (Vue 3)**, **Tailwind CSS**, **Lucide Icons** และ **Prisma ORM (SQLite)** ตามโครงสร้าง UI ครบทั้ง 5 หน้าจอ

---

## 🌟 ฟีเจอร์หลัก (Core Features)

1. **ระบบสแกน QR Code ประจำห้องและดึงประวัติเฉพาะห้อง (Room-Specific QR & History Flow)**:
   - แต่ละห้องจะมี QR Code เฉพาะ เช่น ติดไว้ที่ประตูห้อง โต๊ะเรียน หรือโปรเจกเตอร์
   - **เมื่อสแกนแล้ว**:
     - ระบบจะล็อกพิกัดห้องให้อัตโนมัติ (เช่น *อาคาร 11 ชั้น 5 ห้อง 11-502*)
     - **แสดงประวัติการแจ้งซ่อมย้อนหลัง "เฉพาะของห้องนั้นๆ"**: เพื่อให้ผู้สแกนตรวจสอบได้ทันทีว่าปัญหาที่ตนพบมีคนแจ้งไปแล้วหรือยัง และปัจจุบันช่างกำลังซ่อมอยู่หรือไม่ ช่วยลดการแจ้งซ้ำซ้อน
     - มีปุ่ม **"แจ้งปัญหาในห้องนี้ทันที"** ซึ่งจะกรอกชื่ออาคาร ชั้น และห้องใส่ในฟอร์มให้อัตโนมัติ
   - หากยังไม่ได้สแกนห้อง จะแสดงภาพรวมเหตุการณ์และข่าวสารทั่วไปของทั้งมหาวิทยาลัย

2. **เครื่องมือสร้างและพิมพ์สติกเกอร์ QR Code ประจำห้อง (Admin Room QR Generator)**:
   - อยู่ในแถบเมนูของผู้ดูแลระบบ (`/admin` -> Room QR Generator)
   - เลือกอาคาร ชั้น และระบุชื่อห้อง
   - ระบบจะสร้างแผ่นสติกเกอร์ QR Code มาตรฐาน SPU พร้อมปุ่ม **"Print QR Sticker"** เพื่อสั่งพิมพ์ออกเครื่องพิมพ์ได้ทันที

3. **Issue Form (แบบฟอร์มแจ้งซ่อม `/report`)**:
   - รองรับ Auto-fill อาคารและห้องจาก Query Parameter หรือจากการสแกน QR
   - ตัวเลือกหมวดหมู่แบบ **Button Chips** (Air Conditioner, Lights / Elec, Sanitary, Desk & Chair, Projector / PC, Other)
   - สลับระดับความเร่งด่วน: **Normal** (24-48h) หรือ **Urgent** (แก้ปัญหาด่วน ~30 นาที)
   - ถ่ายภาพ/อัปโหลดภาพก่อนซ่อม (Before Photo) พร้อมพรีวิวทันทีและปุ่มลบ
   - ตัวนับจำนวนตัวอักษรของรายละเอียดปัญหา (`0 / 500`)
   - ระบุอีเมล `@spu.ac.th` พร้อมระบบตรวจสอบความถูกต้อง

4. **My Reports & Tracking (ติดตามสถานะและช่าง `/tracking`)**:
   - แท็บคัดกรองตามสถานะ: All, In Progress, Pending, Resolved
   - **Workflow Progress Stepper** 4 ขั้นตอน: `Received` -> `Assigned` -> `Working` -> `Resolved`
   - หน้าต่างเปรียบเทียบภาพก่อนและหลังซ่อม **Before / After Comparison Modal**
   - แสดงคะแนนรีวิวความพึงพอใจ

5. **Admin & Executive Analytics Portal (`/admin`)**:
   - **4 KPI Metric Cards**: Total Reports (142), Resolution Rate (88.5%), Avg. Repair Time MTTR (3.4h), Satisfaction Score (4.7/5.0)
   - แผนภูมิแท่งความหนาแน่นปัญหาแยกตามอาคาร **Problem Hotspots by Building**
   - แผนภูมิวงแหวน **Issues by Category (Donut Chart)**
   - ตาราง **Live Ticket Management** พร้อมค้นหา กรองสถานะ และมอบหมายช่าง
   - Modal ปรับสถานะงาน พร้อมระบบอัปโหลดภาพ "After-Repair Photo" ก่อนปิดงาน (Resolved)
   - ปุ่ม Export CSV สำหรับออกรายงาน

6. **Automated Multi-Stage Email Tracking Simulator**:
   - บันทึกและจำลองการส่งอีเมลตาม 3 ระยะงาน (Ticket Received -> In Progress -> Repair Completed)
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
3. เบราว์เซอร์จะเปิดหน้าต่างที่ `http://localhost:5555` อัตโนมัติ สามารถดู ค้นหา เพิ่ม แก้ไข หรือลบข้อมูลในทุก Table ได้แบบ Real-time ด้วยหน้าตากราฟิก

### วิธีที่ 3: เปิดไฟล์ฐานข้อมูล SQLite โดยตรง
- ไฟล์ฐานข้อมูลถูกจัดเก็บเป็นไฟล์เดียวที่ `prisma/dev.db`
- สามารถใช้โปรแกรมภายนอก เช่น **DB Browser for SQLite** หรือติดตั้ง Extension **SQLite Viewer** ใน VS Code เพื่อเปิดดูและรันคำสั่ง SQL ได้โดยตรง

---

## 🚀 ขั้นตอนการอัปโหลดขึ้น GitHub (สำหรับ Username: aphisitgit)

เนื่องจากคุณได้เพิ่ม Remote `origin` ไปยัง `https://github.com/aphisitgit/facility-fix-report.git` เรียบร้อยแล้ว ขั้นตอนการนำขึ้น GitHub มีดังนี้:

### ขั้นตอนที่ 1: สร้าง Repository บน GitHub
1. เข้าไปที่เว็บ [https://github.com/new](https://github.com/new) โดยล็อกอินด้วยบัญชี **aphisitgit**
2. ตั้งชื่อ **Repository name** ให้ตรงกันคือ:
   ```
   facility-fix-report
   ```
3. เลือกระดับการเข้าถึงเป็น **Public** หรือ **Private**
4. **ไม่ต้อง** ติ๊กช่อง "Add a README file" หรือ ".gitignore"
5. กดปุ่มสีเขียว **Create repository**

### ขั้นตอนที่ 2: Commit และ Push โค้ดขึ้น GitHub
เปิด Terminal ในโฟลเดอร์โปรเจกต์ (`f:\Dara`):
```bash
# 1. เพิ่มไฟล์ที่มีการแก้ไขล่าสุด
git add .

# 2. Commit การเปลี่ยนแปลง
git commit -m "feat: complete Facility Fix & Report with room QR flow and admin sticker generator"

# 3. กำหนด branch หลักเป็น main
git branch -M main

# 4. Push โค้ดขึ้น GitHub
git push -u origin main
```

---

## 💻 วิธีเปิดใช้งานโปรเจกต์ (Local Setup)

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
- **ตัวอย่างสแกนห้อง 11-502**: [http://localhost:3000/?building=Building%2011&floor=5&room=11-502](http://localhost:3000/?building=Building%2011&floor=5&room=11-502)
- **ตัวอย่างสแกนห้อง 5-301**: [http://localhost:3000/?building=Building%205&floor=3&room=5-301](http://localhost:3000/?building=Building%205&floor=3&room=5-301)
- **แบบฟอร์มแจ้งซ่อม**: [http://localhost:3000/report](http://localhost:3000/report)
- **ติดตามสถานะ**: [http://localhost:3000/tracking](http://localhost:3000/tracking)
- **Executive Analytics (Admin)**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Database Explorer**: [http://localhost:3000/admin/database](http://localhost:3000/admin/database)
- **Room QR Generator**: [http://localhost:3000/admin/qr-generator](http://localhost:3000/admin/qr-generator)
- **หน้าลงทะเบียนเจ้าหน้าที่/แอดมินโดยเฉพาะ (Staff Only)**: [http://localhost:3000/admin/register](http://localhost:3000/admin/register)

### บัญชีผู้ดูแลระบบเริ่มต้นสำหรับทดสอบ (Default Staff Accounts):
| Username | Password | ชื่อเจ้าหน้าที่ / ช่าง | ตำแหน่งงาน |
| :--- | :--- | :--- | :--- |
| `admin` | `admin1234` | Praew Suksom | Operations Director |
| `somchai` | `1234` | ช่างสมชาย กิจเจริญ | ช่างแอร์และเครื่องกล (HVAC Lead) |
| `niran` | `1234` | ช่างนิรันดร์ วงศ์แก้ว | ช่างไฟฟ้าอาวุโส (Senior Electrician) |
| `wichai` | `1234` | ช่างวิชัย นิ่มนวล | ช่างโสตทัศนูปกรณ์ & IT (AV Tech) |

