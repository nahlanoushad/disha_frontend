import { getToken, isSupported, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import studentApi from "../services/studentApi";

const VAPID_KEY =
    "BB7cr4auM-ZvJ5n93SALNJPYLb0okU5rXtzOR6DdWKIZQhUg_1Re14jS2pVlVFe1aQpqtN5Oc3SX8pOKN3ArOK8";

let fcmInitializationPromise = null;

export async function initializeFCM() {
    // Prevent duplicate initialization in development
    if (fcmInitializationPromise) {
        return fcmInitializationPromise;
    }

    fcmInitializationPromise = initializeFCMInternal();

    return fcmInitializationPromise;
}

async function initializeFCMInternal() {
    try {
        const supported = await isSupported();

        if (!supported) {
            console.log("FCM is not supported in this browser.");
            return;
        }

        if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();

            if (permission !== "granted") {
                console.log("Notification permission denied.");
                return;
            }
        }

        const serviceWorkerRegistration =
            await navigator.serviceWorker.register(
                "/firebase-messaging-sw.js"
            );

        console.log("Service worker registered:", serviceWorkerRegistration);

        // Ensure service worker is fully activated and ready
        await navigator.serviceWorker.ready;

        // Obtain the real FCM delivery registration token
        const currentToken = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration
        });

        if (currentToken) {
            console.log("FCM registration token obtained successfully.");

            // Optionally retrieve the installation identifier (FID) as a separate field
            let installationId = null;
            try {
                const { getInstallations, getId } = await import("firebase/installations");
                installationId = await getId(getInstallations());
            } catch (fidErr) {
                console.debug("FID retrieval skipped/unavailable:", fidErr?.message);
            }

            try {
                await studentApi.registerDevice({
                    fcmToken: currentToken,
                    fid: installationId || undefined,
                    platform: "web"
                });
                console.log("Successfully registered device with FCM token to Student profile.");
            } catch (err) {
                console.error("Failed to link FCM token to Student profile:", err);
            }
        } else {
            console.warn("No registration token available. Request permission to generate one.");
        }

        // Foreground Message Handler
        onMessage(messaging, (payload) => {
            console.log("Foreground message received:", payload);

            // Fallback to basic DOM toast for safe foreground UI notification
            const toast = document.createElement("div");
            toast.style.position = "fixed";
            toast.style.top = "20px";
            toast.style.right = "20px";
            toast.style.backgroundColor = "#7c3aed";
            toast.style.color = "white";
            toast.style.padding = "16px";
            toast.style.borderRadius = "8px";
            toast.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.4)";
            toast.style.zIndex = "9999";
            toast.style.fontFamily = "var(--font-sans)";
            toast.style.maxWidth = "300px";

            const title = document.createElement("strong");
            title.style.display = "block";
            title.style.marginBottom = "4px";
            title.innerText = payload.notification?.title || "New Notification";

            const body = document.createElement("span");
            body.style.fontSize = "0.9rem";
            body.innerText = payload.notification?.body || "";

            toast.appendChild(title);
            toast.appendChild(body);

            document.body.appendChild(toast);

            // Auto remove after 5 seconds
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 5000);
        });

        console.log("FCM registration completed.");
    } catch (error) {
        console.error("FCM registration failed:", error);

        // Allow retry if initialization failed
        fcmInitializationPromise = null;
    }
}
