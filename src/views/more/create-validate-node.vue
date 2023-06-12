<template>
  <div class="page-createValidateNode">
    <h2 class="title">{{ $t('more.createValidateNode') }}</h2>
    <div v-if="!status.isSendTx">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="config-form">
        <el-form-item :label="$t('validateNode.nodeName')" prop="nodeName" :required="true">
          <el-input v-model="form.nodeName" :placeholder="$t('validateNode.inputTips.nodeName')" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.nodeLogo')" prop="nodeLogo" :required="false">
          <el-input v-model="form.nodeLogo" :placeholder="$t('validateNode.inputTips.nodeLogo')" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.nodeID')" prop="nodeID" :required="true">
          <el-input v-model="form.nodeID" :placeholder="$t('validateNode.inputTips.nodeID')" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.blsPubKey')" prop="blsPubKey" :required="true">
          <el-input v-model="form.blsPubKey" :placeholder="$t('validateNode.inputTips.blsPubKey')" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.nodeRelayAccount')" prop="nodeManageAddr" :required="true">
          <el-input v-model="form.nodeManageAddr" :placeholder="$t('validateNode.inputTips.nodeRelayAccount')" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.nodeEquityAccount')" prop="rewardReceiveAddr" :required="true">
          <el-input v-model="form.rewardReceiveAddr" :placeholder="$t('validateNode.inputTips.nodeEquityAccount')" clearable autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.stakingAmount')" prop="stakingValue" :required="true">
          <el-input v-model="form.stakingValue" :placeholder="$t('validateNode.inputTips.stakingAmount')" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.acceptDelegate')" prop="isAcceptDelegate" :required="true">
          <el-radio-group v-model="form.isAcceptDelegate">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <connect-metamask
            :account="form.rewardReceiveAddr"
            :check-account="false"
            :check-balance="true"
            :connect-btn-text="$t('validateNode.connectWallet')"
            :connecting-text="$t('validateNode.connecting')"
            :insufficient-balance-text="$t('validateNode.insufficientLAT')"
            :handler-text="$t('validateNode.confirmCreate')"
            :handler-call="_handleCreate"
          ></connect-metamask>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-card class="box-card">
        <div v-if="status.txWaiting">
          <circle2 size="80px" stroke="20px" background="#41b883" color="#fcfdfd" style="margin-left: 40%"></circle2>
          <p style="margin-left: 35%; margin-top: 10px;color: #00070a"> {{ $t('validateNode.creating') }}· </p>
        </div>
        <div v-else-if="!status.txWaiting && status.txStatus == 'success'">
          <img style="margin-left: 40%" src="../../assets/images/success.svg" alt="" />
          <p style="margin-left: 41%; margin-top: 10px;color: #52f328"> {{ $t('validateNode.createSucc') }} </p>
        </div>
        <div v-else>
          <img style="margin-left: 40%" src="../../assets/images/fail.svg" alt="" />
          <p style="margin-left: 35%; margin-top: 10px;color: #f50404"> {{ $t('validateNode.createFailed') }} </p>
        </div>
        <div key="nodeName" class="text item">
          <p>
            <span> {{ $t('validateNode.nodeName') + " :" }} </span>
          </p>
          <p > {{ this.form.nodeName }} </p>
        </div>
        <div key="nodeID" class="text item">
          <p>
            <span> {{ $t('validateNode.nodeID') + " :" }} </span>
          </p>
          <p> {{ this.form.nodeID }} </p>
        </div>
        <div key="blsPubKey" class="text item">
          <p>
            <span> {{ $t('validateNode.blsPubKey') + " :" }} </span>
          </p>
          <p> {{ this.form.blsPubKey }} </p>
        </div>
        <div key="nodeRelayAccount" class="text item">
          <p>
            <span> {{ $t('validateNode.nodeRelayAccount') + " :" }} </span>
          </p>
          <p> {{ this.form.nodeManageAddr }} </p>
        </div>
        <div key="nodeEquityAccount" class="text item">
          <p>
            <span> {{ $t('validateNode.nodeEquityAccount') + ":" }} </span>
          </p>
          <p> {{ this.form.rewardReceiveAddr }} </p>
        </div>
        <div key="stakingAmount" class="text item">
          <p>
            <span> {{ $t('validateNode.stakingAmount') + ":" }} </span>
          </p>
          <p> {{ this.form.stakingValue }} </p>
        </div>
        <div key="acceptDelegate" class="text item">
          <p>
            <span> {{ $t('validateNode.acceptDelegate') + ":" }} </span>
          </p>
          <p> {{ this.form.isAcceptDelegate ? "是" : "否" }} </p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Circle2 } from 'vue-loading-spinner'
import { isAddress } from "@/services/web3-utils";
import connectMetamask from '@/components/connect/connect-metamask'

export default {
  components: {
    Circle2,
    connectMetamask
  },
  name: "create-validate-node",
  data() {
    const inputNodeNameReg = new RegExp(/^[a-zA-Z][a-zA-Z0-9_#]{0,29}$/)
    const hex128Reg = new RegExp(/^[0-9a-fA-F]{128}$/)
    const hex192Reg = new RegExp(/^[0-9a-fA-F]{192}$/)
    const floatReg = new RegExp(/^(0\.\d*[1-9]+\d*|[1-9]\d*(\.\d+)?)$/)
    const inputNodeNameTip = this.$t('validateNode.invalidNodeID')
    const validateAddress = (rule, value, callback) => {
      if (value && isAddress(value)) {
        callback()
      } else {
        callback(new Error(this.$t('validateNode.invalidAddress')));
      }
    };
    const validateNodeName = (rule, value, callback) => {
      if (inputNodeNameReg.test(value) && value !== "") {
        callback();
      } else {
        callback(new Error(this.$t('validateNode.invalidNodeName')));
      }
    };
    const validateNodeID = (rule, value, callback) => {
      if (hex128Reg.test(value) && value !== "") {
        callback();
      } else {
        callback(new Error(this.$t('validateNode.invalidNodeID')));
      }
    }
    const validateBLS = (rule, value, callback) => {
      if (hex192Reg.test(value) && value !== "") {
        callback();
      } else {
        callback(new Error(this.$t('validateNode.invalidBLSPubKey')));
      }
    }
    const validateStakingValue = (rule, value, callback) => {
      if (floatReg.test(value) && value !== 0) {
        callback();
      } else {
        callback(new Error(this.$t('validateNode.lessStakingAmount')));
      }
    }
    return {
      form: {
        nodeName: null,
        nodeLogo: null,
        nodeID: null,
        blsPubKey: null,
        nodeManageAddr: null,
        rewardReceiveAddr: null,
        stakingValue: null,
        isAcceptDelegate: true
      },
      status: {
        isSendTx: false,
        txWaiting: true,
        txStatus: null,
      },
      // isCopy: false,
      rules: {
        nodeName: [
          { required: true, message: this.$t('validateNode.emptyNodeName'), trigger: 'blur' },
          { validator: validateNodeName, trigger: 'blur' }
        ],
        nodeLogo: [
          { required: false, message: this.$t('validateNode.emptyNodeLogo'), trigger: 'blur' },
        ],
        nodeID: [
          { required: true, message: this.$t('validateNode.emptyNodeID'), trigger: ['blur', 'change'] },
          { validator: validateNodeID, trigger: 'blur' }
        ],
        blsPubKey: [
          { required: true, message: this.$t('validateNode.emptyBLSPubKey'), trigger: 'blur' },
          { validator: validateBLS, trigger: 'blur' }
        ],
        nodeManageAddr: [
          { required: true, message: this.$t('validateNode.emptyRelayAccount'), trigger: 'blur' },
          { validator: validateAddress, trigger: 'blur' }
        ],
        rewardReceiveAddr: [
          { required: true, message: this.$t('validateNode.emptyEquityAccount'), trigger: 'blur' },
          { validator: validateAddress, trigger: 'blur' }
        ],
        stakingValue: [
          { required: true, message: this.$t('validateNode.emptyStakingAmount'), trigger: 'blur' },
          { validator: validateStakingValue, trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async _handleCreate() {
      this.status.isSendTx = true
      this.status.txWaiting = true
      await this.sleep(3000)
      this.status.txWaiting = false
      this.status.txStatus = "success"
      console.log('******: ', this.form, this.status)
    },
  }
}
</script>

<style lang="less">
.text {
  font-size: 14px;
  color: #00070a;
}

.item {
  padding: 18px 0;
}

.box-card {
  cursor: default;
  margin-left: 36%;
  width: 480px;
}
.page-createValidateNode {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  .el-form.config-form {
    margin-left: 42%;
    .el-form-item {
      .el-button {
        width: 400px;
        display: inline-block;
      }
      .el-input {
      }
    }
  }
  .title {
    font-family: Gilroy-Medium;
    font-size: 34px;
    color: #000000;
    letter-spacing: 0;
    line-height: 64px;
    margin: 25px 0 20px 0;
    text-align: center;
  }
}
</style>
