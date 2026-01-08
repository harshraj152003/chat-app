# 🌌 Orbit | Real-Time Connection

Orbit is a modern, high-performance chat application designed for seamless real-time communication. Built with the MERN stack, it combines the power of WebSockets for instant messaging with Cloudinary for lightning-fast media sharing.

---

## 🚀 Live Features

* **⚡ Real-time Messaging:** Powered by `Socket.io` for zero-latency communication.
* **📸 Image Sharing:** Integrated with `Cloudinary` for optimized media uploads.
* **🟢 Presence Tracking:** Real-time online/offline status indicators.
* **🔐 Secure Auth:** Robust system using `JWT`, `HttpOnly Cookies`, and `Bcrypt` password hashing.
* **🎨 Sleek UI:** Fully responsive design built with **React** and **Tailwind CSS**.
* **📂 Message History:** Persistent chat storage using **MongoDB**.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Real-time** | Socket.io |
| **Storage** | Cloudinary |
| **Security** | JWT, Bcrypt, CORS, Cookie-Parser |

---

## 🏗️ Architecture Overview



Orbit follows a **Stateful Connection** model. While the REST API handles authentication and profile management, the Socket server manages a pool of active users to broadcast messages and status changes instantly.

---

## 🛠️ Troubleshooting & Support

If you run into any issues while cloning or setting up **Orbit** on your local machine, don't sweat it! I'm here to help you get into orbit.

### Common Hustles:
* **CORS Errors:** Ensure your frontend URL matches the one allowed in your `index.js` CORS config.
* **Socket Disconnects:** Check if the backend server is running on the correct port defined in your `.env`.
* **Image Upload Failures:** Verify your Cloudinary credentials and ensure you're sending the image in the correct format (Base64).

### 📬 Reach Out
For any queries, feature requests, or if you face any hustle while running the project, feel free to contact me:

* **📧 Email:** [harsh912823@gmail.com](mailto:harsh912823@gmail.com)
* **🔗 LinkedIn:** [Harsh Raj](https://www.linkedin.com/in/harshraj152003/)
* **🐙 GitHub:** [@harshraj152003](https://github.com/harshraj152003)

---

**Happy Coding! 🚀**
