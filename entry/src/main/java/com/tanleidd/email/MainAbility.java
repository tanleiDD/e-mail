package com.tanleidd.email;

import ohos.ace.ability.AceAbility;
import ohos.aafwk.content.Intent;

import java.util.ArrayList;
import java.util.List;

public class MainAbility extends AceAbility {
    @Override
    public void onStart(Intent intent) {
        super.onStart(intent);
        requestPermission();
    }
    private void requestPermission() {
        String[]permissions  = {
                "ohos.permission.DISTRIBUTED_DATASYNC",
                "ohos.permission.CAMERA"
        };
        List<String> applyPermissions = new ArrayList<>();
        for (String element : permissions) {
            checkPermission(applyPermissions, element);
        }
        requestPermissionsFromUser(applyPermissions.toArray(new String[0]), 0);
    }

    private void checkPermission(List<String> applyPermissions, String element) {
        if (verifySelfPermission(element) != 0) {
            if (canRequestPermission(element)) {
                applyPermissions.add(element);
            }
        }
    }

    @Override
    public void onStop() {
        super.onStop();
    }
}
