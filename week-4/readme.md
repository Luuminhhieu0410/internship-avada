thứ tự lệnh
avada app:create app
yarn install or npm install
firebase use --add
shopify app config link
npm run dev

# HOW TO QUERY IN FIRESTORE
### 1) **ref (Reference)** – “địa chỉ”

* Là **con trỏ tới 1 collection hoặc 1 document**.
* Không chứa dữ liệu, chỉ giống như *đường dẫn*.

**Ví dụ:**

```js
const userRef = db.collection("users").doc("123");
```

Đây chỉ là **địa chỉ**, **chưa lấy dữ liệu**.



> ref = “reference” = địa chỉ / con trỏ.

---

### 2) **query** – “yêu cầu lọc dữ liệu”

* Tạo ra từ **collection ref**.
* Thêm điều kiện như `where`, `orderBy`, `limit`...
* Cũng **không chứa dữ liệu**, chỉ là cấu hình để Firestore biết bạn muốn lấy gì.

**Ví dụ:**

```js
const q = db.collection("users").where("age", ">", 18);
```


> query = “câu truy vấn” gửi lên Firestore.

---

### 3) **snapshot** – “bản chụp dữ liệu”

Có 2 loại:

###  **DocumentSnapshot**

— kết quả khi bạn `.get()` trên **docRef**

```js
const snap = await userRef.get();
console.log(snap.exists);
console.log(snap.data());
```

Chứa dữ liệu của **một document**.

###  **QuerySnapshot**

— kết quả khi bạn `.get()` trên **query** hoặc **collectionRef**

```js
const snap = await q.get();
console.log(snap.docs);
```

Chứa **nhiều document**.

> snapshot = “bức ảnh chụp lại dữ liệu tại thời điểm đó”.

---

### 4) **docs** – “tập hợp document kết quả”

* Nằm trong **QuerySnapshot**.
* Là **mảng DocumentSnapshot**.

**Ví dụ:**

```js
snap.docs.forEach(doc => console.log(doc.id, doc.data()));
```

> docs = “nhiều document” trong kết quả query.

---

Dưới đây là phần **batch** được giải thích theo đúng phong cách dễ nhớ như trên.

---

### **5) batch – “gói thao tác”**

* Dùng để **ghi nhiều thao tác cùng lúc**: `set`, `update`, `delete`.
* Chỉ thực thi khi bạn gọi `batch.commit()`.
* Hoạt động giống như “**gửi 1 lần duy nhất**”, giảm chi phí và đảm bảo tính **nguyên tử** (all or nothing).

**Ví dụ:**

```js
const batch = db.batch();

batch.set(db.collection("users").doc("a"), { name: "A" });
batch.update(db.collection("users").doc("b"), { age: 20 });
batch.delete(db.collection("users").doc("c"));

await batch.commit();
```



> batch = “gói hành động”, gom nhiều lệnh vào **1 lần gửi**.

---

# TÓM TẮT 
| Từ           | Nghĩa                   | Câu dễ nhớ                             |
| ------------ | ----------------------- | -------------------------------------- |
| **ref**      | con trỏ / địa chỉ       | “ref = chỗ dữ liệu nằm”                |
| **query**    | yêu cầu lọc             | “query = muốn lấy gì”                  |
| **snapshot** | ảnh chụp dữ liệu trả về | “snapshot = kết quả chụp lại”          |
| **docs**     | danh sách document      | “docs = nhiều document trong snapshot” |
| **batch**    | gói các thao tác ghi    | “batch = gom lệnh, gửi một phát”       |

---

# Chuỗi Firestore đầy đủ:

```
ref → query → snapshot → docs → data()
               ↑
        batch → commit()
```


---

