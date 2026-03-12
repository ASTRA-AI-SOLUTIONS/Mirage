package com.mirage.app;

import android.app.StatusBarManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.graphics.drawable.Icon;
import android.media.projection.MediaProjectionManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import org.json.JSONArray;

public class MainActivity extends BridgeActivity {
    private static final int REQUEST_OVERLAY = 1234;
    private static final int REQUEST_MEDIA_PROJECTION = 1001;

    private BroadcastReceiver screenCaptureReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            ArrayList<String> images = intent.getStringArrayListExtra("images");
            if (images != null && !images.isEmpty() && bridge != null && bridge.getWebView() != null) {
                JSONArray jsonArray = new JSONArray(images);
                String jsCode = "window.dispatchEvent(new CustomEvent('onScreenCaptured', { detail: " + jsonArray.toString() + " }));";
                bridge.getWebView().evaluateJavascript(jsCode, null);
            }
        }
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(screenCaptureReceiver, new IntentFilter("com.mirage.app.SCREEN_CAPTURED"), Context.RECEIVER_EXPORTED);
        } else {
            registerReceiver(screenCaptureReceiver, new IntentFilter("com.mirage.app.SCREEN_CAPTURED"));
        }

        // 1. Ask for Floating Bubble Permission
        checkOverlayPermission();
        
        // 2. Prompt to add Scroll Down Widget (Android 13+)
        promptAddQuickSettingsTile();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            unregisterReceiver(screenCaptureReceiver);
        } catch (Exception e) {}
    }

    private void checkOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, REQUEST_OVERLAY);
            } else {
                requestMediaProjection();
            }
        }
    }

    private void requestMediaProjection() {
        MediaProjectionManager mpm = (MediaProjectionManager) getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        if (mpm != null) {
            startActivityForResult(mpm.createScreenCaptureIntent(), REQUEST_MEDIA_PROJECTION);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_OVERLAY) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && Settings.canDrawOverlays(this)) {
                requestMediaProjection();
            }
        } else if (requestCode == REQUEST_MEDIA_PROJECTION) {
            if (resultCode == RESULT_OK && data != null) {
                startBubbleService(resultCode, data);
            }
        }
    }

    private void startBubbleService(int resultCode, Intent data) {
        Intent serviceIntent = new Intent(this, FloatingBubbleService.class);
        serviceIntent.setAction("START_PROJECTION");
        serviceIntent.putExtra("RESULT_CODE", resultCode);
        serviceIntent.putExtra("DATA", data);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
        } else {
            startService(serviceIntent);
        }
    }

    private void promptAddQuickSettingsTile() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            StatusBarManager statusBarManager = getSystemService(StatusBarManager.class);
            ComponentName componentName = new ComponentName(this, MirageTileService.class);
            Icon icon = Icon.createWithResource(this, android.R.drawable.ic_menu_search);
            
            statusBarManager.requestAddTileService(
                componentName, "Mirage Scan", icon, getMainExecutor(), result -> {}
            );
        }
    }
}
