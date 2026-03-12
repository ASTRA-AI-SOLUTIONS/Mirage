package com.mirage.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.os.IBinder;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import androidx.core.app.NotificationCompat;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;

public class FloatingBubbleService extends Service {
    private WindowManager windowManager;
    private View floatingView;
    private MediaProjection mediaProjection;
    private VirtualDisplay virtualDisplay;
    private ImageReader imageReader;
    private int screenWidth;
    private int screenHeight;
    private int screenDensity;

    private Handler captureHandler = new Handler(Looper.getMainLooper());
    private ArrayList<String> capturedFrames = new ArrayList<>();
    private int frameCount = 0;
    private static final int MAX_FRAMES = 5;
    private static final int FRAME_DELAY_MS = 200;
    private boolean isCapturing = false;

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && "START_PROJECTION".equals(intent.getAction())) {
            int resultCode = intent.getIntExtra("RESULT_CODE", 0);
            Intent data = intent.getParcelableExtra("DATA");
            if (data != null) {
                MediaProjectionManager mpm = (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
                if (mpm != null) {
                    mediaProjection = mpm.getMediaProjection(resultCode, data);
                    setupVirtualDisplay();
                }
            }
        }
        return START_STICKY;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        
        // TRUECALLER SECRET: Make it a Foreground Service so Android doesn't kill it!
        createNotificationChannel();
        Notification notification = new NotificationCompat.Builder(this, "mirage_channel")
                .setContentTitle("Mirage is Active")
                .setContentText("Floating bubble is ready to scan.")
                .setSmallIcon(android.R.drawable.ic_menu_search) 
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .build();
        if (Build.VERSION.SDK_INT >= 34) { // Android 14+
            startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE | ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);
        } else if (Build.VERSION.SDK_INT >= 29) {
            startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);
        } else {
            startForeground(1, notification);
        }

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

        ImageView bubbleIcon = new ImageView(this);
        bubbleIcon.setImageResource(android.R.drawable.ic_menu_search); // The icon

        int layoutFlag = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O 
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY 
                : WindowManager.LayoutParams.TYPE_PHONE;

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                150, 150, // Width and Height of bubble
                layoutFlag,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT);

        params.gravity = Gravity.TOP | Gravity.LEFT;
        params.x = 0;
        params.y = 200;

        windowManager.addView(bubbleIcon, params);
        floatingView = bubbleIcon;

        // Make it draggable and clickable
        floatingView.setOnTouchListener(new View.OnTouchListener() {
            private int initialX, initialY;
            private float initialTouchX, initialTouchY;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x;
                        initialY = params.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        params.x = initialX + (int) (event.getRawX() - initialTouchX);
                        params.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(floatingView, params);
                        return true;
                    case MotionEvent.ACTION_UP:
                        // If it was a tap instead of a drag, capture screen!
                        int diffX = (int) (event.getRawX() - initialTouchX);
                        int diffY = (int) (event.getRawY() - initialTouchY);
                        if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
                            if (mediaProjection != null) {
                                startMultiFrameCapture();
                            } else {
                                // Fallback if projection isn't ready
                                Intent launchIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());
                                if (launchIntent != null) {
                                    launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                    startActivity(launchIntent);
                                }
                            }
                        }
                        return true;
                }
                return false;
            }
        });
    }

    private void setupVirtualDisplay() {
        DisplayMetrics metrics = getResources().getDisplayMetrics();
        screenWidth = metrics.widthPixels;
        screenHeight = metrics.heightPixels;
        screenDensity = metrics.densityDpi;

        imageReader = ImageReader.newInstance(screenWidth, screenHeight, PixelFormat.RGBA_8888, 2);
        virtualDisplay = mediaProjection.createVirtualDisplay("ScreenCapture",
                screenWidth, screenHeight, screenDensity,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                imageReader.getSurface(), null, null);
    }

    private String captureSingleFrame() {
        if (imageReader == null) return null;
        Image image = imageReader.acquireLatestImage();
        if (image != null) {
            Image.Plane[] planes = image.getPlanes();
            ByteBuffer buffer = planes[0].getBuffer();
            int pixelStride = planes[0].getPixelStride();
            int rowStride = planes[0].getRowStride();
            int rowPadding = rowStride - pixelStride * screenWidth;

            Bitmap bitmap = Bitmap.createBitmap(screenWidth + rowPadding / pixelStride, screenHeight, Bitmap.Config.ARGB_8888);
            bitmap.copyPixelsFromBuffer(buffer);
            image.close();

            // Crop to actual screen width
            Bitmap croppedBitmap = Bitmap.createBitmap(bitmap, 0, 0, screenWidth, screenHeight);

            // Scale down to save memory/bandwidth for Gemini
            Bitmap scaledBitmap = Bitmap.createScaledBitmap(croppedBitmap, screenWidth / 2, screenHeight / 2, true);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            scaledBitmap.compress(Bitmap.CompressFormat.JPEG, 40, baos);
            byte[] imageBytes = baos.toByteArray();
            return Base64.encodeToString(imageBytes, Base64.NO_WRAP);
        }
        return null;
    }

    private void startMultiFrameCapture() {
        if (isCapturing) return;
        isCapturing = true;
        capturedFrames.clear();
        frameCount = 0;
        
        if (floatingView != null) {
            floatingView.setAlpha(0.5f);
        }

        captureHandler.post(new Runnable() {
            @Override
            public void run() {
                if (frameCount < MAX_FRAMES) {
                    String frame = captureSingleFrame();
                    if (frame != null) {
                        capturedFrames.add(frame);
                    }
                    frameCount++;
                    captureHandler.postDelayed(this, FRAME_DELAY_MS);
                } else {
                    isCapturing = false;
                    if (floatingView != null) {
                        floatingView.setAlpha(1.0f);
                    }
                    if (!capturedFrames.isEmpty()) {
                        Intent intent = new Intent("com.mirage.app.SCREEN_CAPTURED");
                        intent.putStringArrayListExtra("images", capturedFrames);
                        sendBroadcast(intent);

                        // Bring app to front
                        Intent launchIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());
                        if (launchIntent != null) {
                            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                            startActivity(launchIntent);
                        }
                    }
                }
            }
        });
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "mirage_channel", "Mirage Service", NotificationManager.IMPORTANCE_MIN);
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (floatingView != null) windowManager.removeView(floatingView);
        if (virtualDisplay != null) virtualDisplay.release();
        if (imageReader != null) imageReader.close();
        if (mediaProjection != null) mediaProjection.stop();
    }
}
