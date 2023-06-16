<template>
  <div class="btn-wrapper">
    <el-button v-if="!status.isValidNetwork" type="danger" :disabled="false">
      {{ $t('validateNode.invalidNetwork') }}
    </el-button>
    <el-button v-else-if="status.account && checkBalance && status.balance == 0" type="primary" :disabled="true">
      {{ insufficientBalanceText }}
    </el-button>
    <el-button v-else-if="status.account && checkAccount && status.account != account" type="primary" :disabled="false">
      {{ invalidAccountText }}
    </el-button>
    <el-button v-else-if="status.account" type="primary" @click="handlerCall">{{ handlerText }}</el-button>
    <el-button v-else-if="status.loading" type="primary" :disabled="true">{{ connectingText }}</el-button>
    <el-button v-else type="primary" @click="connect" icon="el-icon-metamask-fox" :disabled="status.connect">
      {{ connectBtnText }}
    </el-button>
    <div v-if="status.account && checkAccount && status.account != account">
      <el-alert :closable="false" v-bind:title="invalidAccountTips" type="error" effect="dark"></el-alert>
    </div>
  </div>
</template>

<script>
import { NET_NAME, CHAIN_ID, RPC_URL, BASE_BSC_SCAN_URL } from '@/config/platon-config'

export default {
  name: 'connectMetaMask',
  props: {
    account: String,
    checkAccount: Boolean,
    checkBalance: Boolean,
    insufficientBalanceText: String,
    invalidAccountText: String,
    invalidAccountTips: String,
    connectingText: String,
    connectBtnText: String,
    handlerText: String,
    handlerCall: Function
  },
  data() {
    return {
      status: {
        isMobile: true,
        isChrome: true,
        metamaskEnable: false,
        isValidNetwork: false,
        connect: false,
        loading: false,
        account: '',
        balance: 0,
        hskBalance: 0
      }
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale == 'en' ? 'en' : 'cn'
    }
  },
  methods: {
    async setAccount(accounts) {
      this.status.account = accounts[0] || ''
      if (this.status.account) {
        this.status.balance = parseInt(
          await ethereum.request({
            method: 'eth_getBalance',
            params: [this.status.account]
          })
        )
        // this.status.hskBalance = await ethereum.request({method: 'eth_call', params: [{data: '', to: ''}]})
      }
    },
    validNetwork() {
      return parseInt(ethereum?.chainId) == CHAIN_ID
    },
    async setNetwork(chainId) {
      if (this.validNetwork()) {
        this.status.isValidNetwork = true
      } else {
        this.status.isValidNetwork = false
        await this.switchNetwork()
      }
      if (this.status.account) {
        this.status.balance = parseInt(
          await ethereum.request({
            method: 'eth_getBalance',
            params: [this.status.account]
          })
        )
        // this.status.hskBalance = await ethereum.request({method: 'eth_call', params: [{data: '', to: ''}]})
      }
    },
    handleErr(error) {
      console.log('error: ', error)
      let msg = error.message
      if (this.lang === 'cn' && error.code === 4001) {
        msg = '用户拒绝了该请求'
      }
      this.$message.error(msg)
    },
    async switchNetwork() {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${CHAIN_ID.toString(16)}`
            }
          ]
        })
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${CHAIN_ID.toString(16)}`,
                  chainName: NET_NAME,
                  nativeCurrency: {
                    name: 'PlatON',
                    symbol: 'LAT',
                    decimals: 18
                  },
                  rpcUrls: [RPC_URL],
                  blockExplorerUrls: [BASE_BSC_SCAN_URL]
                }
              ]
            })
          } catch (addError) {
            console.error('Failed to setup the network in Metamask:', addError)
            return
          }
        }
        return
      }
    },
    connect() {
      if (!this.status.metamaskEnable) {
        this.$alert(this.$t('extension.error.noMetaMask'), this.$t('extension.error.tips'), {
          type: 'warning',
          dangerouslyUseHTMLString: true,
          showConfirmButton: false
        })
        return
      }
      this.status.loading = true
      this.status.connect = true
      ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(this.setAccount)
        .catch(this.handleErr)
        .finally(() => {
          this.status.connect = false
          this.status.loading = false
        })
    }
  },
  async created() {
    const ua = navigator.userAgent
    this.status.isMobile = !!ua.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
    this.status.isChrome = !!ua.match(/chrome/i)
  },
  async mounted() {
    this.status.metamaskEnable = Boolean(window.ethereum && window.ethereum.isMetaMask)
    if (this.status.metamaskEnable) {
      ethereum.on('accountsChanged', this.setAccount)
      ethereum.on('chainChanged', this.setNetwork)
      ethereum.request({ method: 'eth_accounts' }).then(async () => this.setAccount)
      if (!this.validNetwork()) {
        this.status.isValidNetwork = false
        await this.switchNetwork()
      } else {
        this.status.isValidNetwork = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.btn-wrapper {
  width: 100%;
  .el-button {
    height: 50px;
    display: flex;
    align-items: center;
  }
}
</style>
