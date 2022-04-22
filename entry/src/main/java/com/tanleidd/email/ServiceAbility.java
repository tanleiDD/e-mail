package com.tanleidd.email;

import ohos.aafwk.ability.Ability;
import ohos.aafwk.content.Intent;
import ohos.aafwk.content.Operation;
import ohos.app.Context;
import ohos.rpc.*;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;

import java.io.OutputStream;
import java.net.Socket;

public class ServiceAbility extends Ability {
    private static final HiLogLabel LABEL_LOG = new HiLogLabel(3, 0xD001100, "Demo");
    private static final int OPEN_NEWPAGE = 1001;
    private ServiceAbility.MyRemote myRemote;

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
            switch (code) {
                case OPEN_NEWPAGE:
                    Intent intent = new Intent();
                    Operation operation = new Intent.OperationBuilder().withBundleName(getBundleName())
                            .withAbilityName(MainAbility2.class.getName()).build();
                    intent.setOperation(operation);
                    startAbility(intent);
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
        myRemote = new ServiceAbility.MyRemote(context);

        return myRemote.asObject();
    }

    @Override
    public void onDisconnect(Intent intent) {
    }
}