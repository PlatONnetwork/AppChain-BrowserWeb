<template>
  <div class="page-createValidateNode">
    <h2 class="title">{{ $t('more.createValidateNode') }}</h2>
    <div v-if="!status.isSendTx" class="form-box">
      <el-form ref="form" :model="form" :rules="rules" class="config-form">
        <el-form-item :label="$t('validateNode.nodeName')" prop="nodeName" :required="true">
          <el-input
            v-model="form.nodeName"
            :placeholder="$t('validateNode.inputTips.nodeName')"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.nodeLogo')" prop="nodeLogo" :required="false">
          <el-input
            v-model="form.nodeLogo"
            :placeholder="$t('validateNode.inputTips.nodeLogo')"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.nodeID')" prop="nodeID" :required="true">
          <el-input
            v-model="form.nodeID"
            :placeholder="$t('validateNode.inputTips.nodeID')"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.blsPubKey')" prop="blsPubKey" :required="true">
          <el-input
            v-model="form.blsPubKey"
            :placeholder="$t('validateNode.inputTips.blsPubKey')"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.nodeRelayAccount')" prop="nodeManageAddr" :required="true">
          <el-input
            v-model="form.nodeManageAddr"
            :placeholder="$t('validateNode.inputTips.nodeRelayAccount')"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.nodeEquityAccount')" prop="rewardReceiveAddr" :required="true">
          <el-input
            v-model="form.rewardReceiveAddr"
            :placeholder="$t('validateNode.inputTips.nodeEquityAccount')"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.stakingAmount')" prop="stakingValue" :required="true">
          <el-input
            v-model="form.stakingValue"
            :placeholder="$t('validateNode.inputTips.stakingAmount')"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('validateNode.acceptDelegate')" prop="isAcceptDelegate" :required="true">
          <!-- <el-input ></el-input> -->
          <div class="radio-box">
            <el-radio-group v-model="form.isAcceptDelegate" type="vertical">
              <el-radio :label="true">{{ $t('more.yes') }}</el-radio>
              <el-radio :label="false">{{ $t('more.no') }}</el-radio>
            </el-radio-group>
          </div>
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
    <el-card v-else class="card-box">
      <div class="status-header-box" v-if="status.txWaiting">
        <img class="spin-img" src="@/assets/images/spin.svg" alt="" />
        <p class="status process">{{ $t('validateNode.creating') }}·</p>
      </div>
      <div class="status-header-box" v-else-if="!status.txWaiting && status.txStatus == 'success'">
        <img src="../../assets/images/success.svg" alt="" />
        <p class="status success">
          {{ $t('validateNode.createSucc') }}
        </p>
      </div>
      <div class="status-header-box" v-else>
        <img src="../../assets/images/fail.svg" alt="" />
        <p class="status failed">
          {{ $t('validateNode.createFailed') }}
        </p>
      </div>
      <div key="nodeName" class="text item">
        <p>
          {{ $t('validateNode.nodeName') + ' :' }}
        </p>
        <p>{{ this.form.nodeName }}</p>
      </div>
      <div key="nodeID" class="text item">
        <p>
          {{ $t('validateNode.nodeID') + ' :' }}
        </p>
        <p>{{ this.form.nodeID }}</p>
      </div>
      <div key="blsPubKey" class="text item">
        <p>
          {{ $t('validateNode.blsPubKey') + ' :' }}
        </p>
        <p>{{ this.form.blsPubKey }}</p>
      </div>
      <div key="nodeRelayAccount" class="text item">
        <p>
          {{ $t('validateNode.nodeRelayAccount') + ' :' }}
        </p>
        <p>{{ this.form.nodeManageAddr }}</p>
      </div>
      <div key="nodeEquityAccount" class="text item">
        <p>
          {{ $t('validateNode.nodeEquityAccount') + ':' }}
        </p>
        <p>{{ this.form.rewardReceiveAddr }}</p>
      </div>
      <div key="stakingAmount" class="text item">
        <p>
          {{ $t('validateNode.stakingAmount') + ':' }}
        </p>
        <p>{{ this.form.stakingValue }}</p>
      </div>
      <div key="acceptDelegate" class="text item">
        <p>
          {{ $t('validateNode.acceptDelegate') + ':' }}
        </p>
        <p>{{ this.form.isAcceptDelegate ? $t('more.yes') : $t('more.no') }}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { isAddress } from '@/services/web3-utils'
import connectMetamask from '@/components/connect/connect-metamask'
import StakeManagerAbi from '@/config/abi/StakeManager.json'
import { StakeManagerProxy } from '@/config/abi/address.js'
import web3 from 'web3'
import { getAccounts } from '@/services/web3-tools'
import { async } from 'q'

export default {
  components: {
    connectMetamask
  },
  name: 'create-validate-node',
  data() {
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
        txStatus: null
      }
      // isCopy: false,
      // rules: {
      //   nodeName: [
      //     { required: true, message: this.$t('validateNode.emptyNodeName'), trigger: 'blur' },
      //     { validator: validateNodeName, trigger: 'blur' },
      //   ],
      //   nodeLogo: [{ required: false, message: this.$t('validateNode.emptyNodeLogo'), trigger: 'blur' }],
      //   nodeID: [
      //     { required: true, message: this.$t('validateNode.emptyNodeID'), trigger: ['blur', 'change'] },
      //     { validator: validateNodeID, trigger: 'blur' },
      //   ],
      //   blsPubKey: [
      //     { required: true, message: this.$t('validateNode.emptyBLSPubKey'), trigger: 'blur' },
      //     { validator: validateBLS, trigger: 'blur' },
      //   ],
      //   nodeManageAddr: [
      //     { required: true, message: this.$t('validateNode.emptyRelayAccount'), trigger: 'blur' },
      //     { validator: validateAddress, trigger: 'blur' },
      //   ],
      //   rewardReceiveAddr: [
      //     { required: true, message: this.$t('validateNode.emptyEquityAccount'), trigger: 'blur' },
      //     { validator: validateAddress, trigger: 'blur' },
      //   ],
      //   stakingValue: [
      //     { required: true, message: this.$t('validateNode.emptyStakingAmount'), trigger: 'blur' },
      //     { validator: validateStakingValue, trigger: 'blur' },
      //   ],
      // },
    }
  },
  computed: {
    rules() {
      const inputNodeNameReg = new RegExp(/^[a-zA-Z][a-zA-Z0-9_#]{0,29}$/)
      const hex128Reg = new RegExp(/^[0-9a-fA-F]{128}$/)
      const hex192Reg = new RegExp(/^[0-9a-fA-F]{192}$/)
      const floatReg = new RegExp(/^(0\.\d*[1-9]+\d*|[1-9]\d*(\.\d+)?)$/)
      const inputNodeNameTip = this.$t('validateNode.invalidNodeID')
      const validateAddress = (rule, value, callback) => {
        if (value && isAddress(value)) {
          callback()
        } else {
          callback(new Error(this.$t('validateNode.invalidAddress')))
        }
      }
      const validateNodeName = (rule, value, callback) => {
        if (inputNodeNameReg.test(value) && value !== '') {
          callback()
        } else {
          callback(new Error(this.$t('validateNode.invalidNodeName')))
        }
      }
      const validateNodeID = (rule, value, callback) => {
        if (hex128Reg.test(value) && value !== '') {
          callback()
        } else {
          callback(new Error(this.$t('validateNode.invalidNodeID')))
        }
      }
      const validateBLS = (rule, value, callback) => {
        if (hex192Reg.test(value) && value !== '') {
          callback()
        } else {
          callback(new Error(this.$t('validateNode.invalidBLSPubKey')))
        }
      }
      const validateStakingValue = (rule, value, callback) => {
        if (floatReg.test(value) && value !== 0) {
          callback()
        } else {
          callback(new Error(this.$t('validateNode.lessStakingAmount')))
        }
      }
      return {
        nodeName: [
          { required: true, message: this.$t('validateNode.emptyNodeName'), trigger: 'blur' },
          { validator: validateNodeName, trigger: 'blur' }
        ],
        nodeLogo: [{ required: false, message: this.$t('validateNode.emptyNodeLogo'), trigger: 'blur' }],
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
        ]
      }
    }
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    skateForFn() {},

    async _handleCreate() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // this.status.isSendTx = true
          if (!window.ethereum) return message.error('Please install metamask')
          const address = await getAccounts()
          const web3ctx = new web3(window.ethereum)
          const myContract = new web3ctx.eth.Contract(StakeManagerAbi, StakeManagerProxy)
          // handle stake
          const params = {
            owner: address,
            desc: '',
            blsPubkey: this.form.blsPubKey,
            benefit: this.form.rewardReceiveAddr,
            amount: this.form.stakingValue,
            heimdallFee: 'address',
            acceptDelegation: 'address',
            signerPubkey: 'address'
          }

          myContract.methods.stakeFor(params).call()

          console.log('myContract', myContract)

          // this.status.txWaiting = true
          // await this.sleep(3000)
          // this.status.txWaiting = false
          // this.status.txStatus = 'success'
          console.log('******: ', this.form, this.status)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.card-box {
  cursor: default;
  width: 480px;
  .status-header-box {
    width: 100%;
    text-align: center;
    margin: 0 auto;
    .status {
      font-size: 16px;
      margin-top: 10px;
    }

    .spin-img {
      width: 66px;
      height: 66px;
      animation: rotate 1s linear infinite;
    }

    .rotate {
      transform: rotate(360deg);
    }

    img {
      margin: 0 auto;
    }
    .process {
      color: #dc9c17;
    }
    .success {
      color: #70b603;
    }
    .failed {
      color: #f50404;
    }
  }

  .text {
    font-size: 14px;
    color: #00070a;
  }

  .item {
    padding: 18px 0;
    display: flex;
    gap: 10px;
  }
}
.page-createValidateNode {
  width: 500px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  .form-box {
    width: 420px;
    margin: 0 auto;
  }
  .el-form.config-form {
    .el-form-item {
      .el-button {
        width: 100%;
        display: inline-block;
      }
      .el-input {
        border: 1px solid #ebeef5;
      }
      .radio-box {
        position: relative;
        display: inline-block;
        width: 100%;

        .el-radio__inner {
          border: 1px solid #000;
        }
        .el-radio__input.is-checked .el-radio__inner {
          background: #000;
        }
        .el-radio__label {
          color: #000;
        }
      }
    }
  }
  .title {
    width: 480px;
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
