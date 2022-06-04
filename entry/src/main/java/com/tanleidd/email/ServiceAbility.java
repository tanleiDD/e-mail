package com.tanleidd.email;

import ohos.aafwk.ability.Ability;
import ohos.aafwk.content.Intent;
import ohos.aafwk.content.Operation;
import ohos.app.Context;
import ohos.distributedschedule.interwork.DeviceInfo;
import ohos.distributedschedule.interwork.DeviceManager;
import ohos.rpc.*;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.utils.zson.ZSONObject;


import java.io.OutputStream;
import java.net.Socket;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ServiceAbility extends Ability {
    private static final HiLogLabel LABEL_LOG = new HiLogLabel(3, 0xD001100, "Demo");
    private static final int OPEN_NEWPAGE = 1001;
    private static final int CONTINUATION = 1002;

    class MyRemote extends RemoteObject implements IRemoteBroker {
        private Context context;
        private Socket socket = null;
        private OutputStream os = null;

        public MyRemote(Context context) {
            super("MyRemote");
            this.context = context;
        }

        @Override
        public boolean onRemoteRequest(int code, MessageParcel data, MessageParcel reply, MessageOption option) throws RemoteException {
            super.onRemoteRequest(code, data, reply, option);

            Map<String, Object> result = new HashMap<>();
            switch (code) {
                case OPEN_NEWPAGE:
                    break;
                case CONTINUATION:
                    // 通过FLAG_GET_ONLINE_DEVICE标记获得在线设备列表

                    List<DeviceInfo> deviceInfoList = DeviceManager.getDeviceList(DeviceInfo.FLAG_GET_ONLINE_DEVICE);

//                    try {
//                        continueAbility(deviceInfoList.get(0).getDeviceId());
//
//                    } catch (Exception e) {
//                        HiLog.info(LABEL_LOG,"app log:" + e.toString());
//                    }

                    result.put("code", 0);
                    result.put("list", deviceInfoList);

                    reply.writeString(ZSONObject.toZSONString(result));
                    break;
                default:
                    return false;
            }


            return true;
        }

        @Override
        public IRemoteObject asObject() {
            return this;
        }
    }
    @Override
    public void onStart(Intent intent) {
        HiLog.error(LABEL_LOG, "ServiceAbility::onStart");
        super.onStart(intent);
    }

    @Override
    public void onBackground() {
        super.onBackground();
        HiLog.info(LABEL_LOG, "ServiceAbility::onBackground");
    }

    @Override
    public void onStop() {
        super.onStop();
        HiLog.info(LABEL_LOG, "ServiceAbility::onStop");
    }

    @Override
    public void onCommand(Intent intent, boolean restart, int startId) {
    }

    @Override
    public IRemoteObject onConnect(Intent intent) {
        super.onConnect(intent);
        Context context = getContext();
        ServiceAbility.MyRemote myRemote = new ServiceAbility.MyRemote(context);

        return myRemote.asObject();
    }

    @Override
    public void onDisconnect(Intent intent) {
    }
}