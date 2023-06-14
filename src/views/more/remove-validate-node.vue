<template>
  <div class="page-removeValidateNode">
    <h2 class="title">{{ $t('more.removeValidateNode') }}</h2>
    <div v-if="!form.rewardReceiveAddr">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="config-form">
        <el-form-item :label="$t('validateNode.nodeID')" prop="nodeID" :required="true">
          <el-input v-model="form.nodeID" :placeholder="$t('validateNode.inputTips.inputNodeID')" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            @click="getNodeInfo"
            :disabled="false"> {{ $t('search.searchBtn') }} </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <div v-if="!status.isSendTx">
        <el-card class="box-card">
          <div key="nodeID" class="text item">
            <p>
              <span> {{ $t('validateNode.nodeID') + " :" }} </span>
            </p>
            <p > {{ this.form.nodeID }} </p>
          </div>
          <div key="nodeEquityAccount" class="text item">
            <p>
              <span> {{ $t('validateNode.nodeEquityAccount') + " :" }} </span>
            </p>
            <p > {{ this.form.rewardReceiveAddr }} </p>
          </div>
          <connect-metamask
            :account="form.rewardReceiveAddr"
            :check-account="true"
            :check-balance="false"
            :connect-btn-text="$t('validateNode.connectEquityAccount')"
            :connecting-text="$t('validateNode.connecting')"
            :invalid-account-text="$t('validateNode.connectEquityAccount')"
            :invalid-account-tips="'连接的不是节点权益账户，无法执行操作，请在MetaMask上断开连接后，重新连接账户。'"
            :handler-text="$t('validateNode.confirmExit')"
            :handler-call="_handleRemove"
            ></connect-metamask>
        </el-card>
      </div>
      <div v-else>
        <el-card class="box-card">
          <div v-if="status.txWaiting">
            <!-- <circle2 size="80px" stroke="20px" background="#41b883" color="#fcfdfd" style="margin-left: 40%"></circle2> -->
            <p style="margin-left: 35%; margin-top: 10px;color: #00070a"> {{ $t('validateNode.processing') }}· </p>
          </div>
          <div v-else-if="!status.txWaiting && status.txStatus == 'success'">
            <img style="margin-left: 40%" src="../../assets/images/success.svg" alt="" />
            <p style="margin-left: 41%; margin-top: 10px;color: #52f328"> {{ $t('validateNode.processSucc') }} </p>
          </div>
          <div v-else>
            <img style="margin-left: 40%" src="../../assets/images/fail.svg" alt="" />
            <p style="margin-left: 35%; margin-top: 10px;color: #f50404"> {{ $t('validateNode.processFailed') }} </p>
          </div>
          <div key="nodeID" class="text item">
            <p>
              <span> {{ $t('validateNode.nodeID') + " :" }} </span>
            </p>
            <p > {{ this.form.nodeID }} </p>
          </div>
          <div key="nodeEquityAccount" class="text item">
            <p>
              <span> {{ $t('validateNode.nodeEquityAccount') + ":" }} </span>
            </p>
            <p> {{ this.form.rewardReceiveAddr }} </p>
          </div>
        </el-card>
      </div>
    </div>
  </div>

</template>

<script>
import connectMetamask from '@/components/connect/connect-metamask'

export default {
  components: {
    // Circle2,
    connectMetamask
  },
  name: "remove-validate-node",
  data() {
    const hex128Reg = new RegExp(/^[0-9a-fA-F]{128}$/)
    const validateNodeID = (rule, value, callback) => {
      if (hex128Reg.test(value) && value !== "") {
        callback();
      } else {
        callback(new Error(this.$t('validateNode.invalidNodeID')));
      }
    }
    return {
      form: {
        nodeID: null,
        rewardReceiveAddr: null,
      },
      status: {
        isSendTx: false,
        txWaiting: true,
        txStatus: null,
      },
      // isCopy: false,
      rules: {
        nodeID: [
          { required: true, message: this.$t('validateNode.emptyNodeID'), trigger: ['blur', 'change'] },
          { validator: validateNodeID, trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    async getNodeInfo() {
      // 根据nodeID调用接口获取node info
      this.form.rewardReceiveAddr = '0x810b7bacEfD5ba495bB688bbFD2501C904036AB7'.toLowerCase()
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async _handleRemove() {
      this.status.isSendTx = true
      this.status.txWaiting = true
      await this.sleep(3000)
      this.status.txWaiting = false
      this.status.txStatus = "success"
      console.log("status: ", this.status)
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
  margin-left: 30%;
  width: 480px;
}
.page-removeValidateNode {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  .el-button {
    width: 480px;
    display: inline-block;
  }
  .el-form.config-form {
    margin-left: 42%;
    .el-form-item {
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
