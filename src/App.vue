<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import enquireScreen from "@/utils/device";

export default {
  data() {
    return {
      locale: zhCN,
    };
  },
  created() {
    let that = this;
    enquireScreen((deviceType) => {
      // tablet
      if (deviceType === 0) {
        that.$store.commit("TOGGLE_DEVICE", "mobile");
        that.$store.dispatch("setSidebar", false);
      }
      // mobile
      else if (deviceType === 1) {
        that.$store.commit("TOGGLE_DEVICE", "mobile");
        that.$store.dispatch("setSidebar", false);
      } else {
        that.$store.commit("TOGGLE_DEVICE", "desktop");
        that.$store.dispatch("setSidebar", true);
      }
    });
  },
};
</script>
<style lang="less">
.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner:after {
  border-color: #C0C4CC;;
}
.ant-calendar-picker-input.ant-input{
  width: 360px !important;
}
.ant-radio-disabled + span {
  color: #fff !important;
}
.ant-btn:hover{
  color: #157b85;
  background: #157b85 !important; 
    border-color: #157b85;
    
}
.ant-btn:hover,
.ant-btn:focus,
.ant-btn:active,
.ant-btn.active {
  background: #157b85;
}
.ant-btn{
  color: #fff !important;
}
.is-current {
  background: rgba(0, 255, 247, 0.17);
}
.ant-form-item-control {
  display: flex;
  flex-direction: column;
  .ant-form-item-children {
    display: flex;
    flex-direction: row;
    color: #ffffff !important;
    .ant-checkbox-group {
      display: flex;
      flex-direction: column !important;
      flex-wrap: wrap;
    }
  }
}
.ant-select-selection__choice {
  background: none !important;
  border: none !important;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px !important;
  color: #ffffff !important;
  line-height: 40px !important;
  height: 40px !important;
  margin: 0 !important;
}
.ant-select-selection__choice__remove {
  color: rgba(31, 255, 242, 0.3) !important;
}
.ant-checkbox + span {
  color: #fff !important;
}
#app {
  height: 100%;
}
.ant-radio-group {
  line-height: 2.5 !important;
}
.ant-drawer-close {
  color: #fff !important;
}
.main {
  height: 100%;
}
.ant-modal-title {
  color: #ffffff !important;
}
.ant-popover-inner-content {
  background: #185f63 !important;
  .ant-popover-message-title {
    color: #fff !important;
  }
}
.ant-calendar-date-panel {
  background: #0d7678 !important;
  border: 1px solid #1ffff2;
  .ant-calendar-date {
    color: rgba(255, 255, 255, 0.9) !important;
  }
  .ant-calendar-input {
    background: #0d7678 !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }
}
.ant-calendar-input-wrap {
  border-bottom: 1px solid #1ffff2 !important;
}
.ant-calendar-body {
  border-top: 1px solid #1ffff2 !important;
}
.ant-calendar-range .ant-calendar-in-range-cell::before {
  background: #00888a !important;
}
.ant-calendar-picker-clear {
  background: #fff !important;
}
.ant-select-dropdown {
  background: #0a6e70 !important;
  border-radius: 3px 3px 3px 3px !important;
  border: 1px solid #1ffff2 !important;
  .ant-select-dropdown-menu-item {
    color: rgba(255, 255, 255, 0.9);
  }
}

.ant-select-dropdown-menu-item-disabled:hover {
  background: #0a6e70 !important;
}

.ant-cascader-menu {
  background: #0a6e70;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #1ffff2;
}

.ant-form-item-required:before {
  color: #1ffff2 !important;
}

.inputs {
  .ant-input {
    height: 40px !important;
    background: rgba(31, 255, 242, 0.3) !important;
    border-radius: 3px 3px 3px 3px !important;
    border: 1px solid #1ffff2 !important;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4) !important;
  }
  .ant-btn {
    min-width: 114px;
    height: 40px;
    background: #00ada3;
    border-radius: 3px 3px 3px 3px;
  }

  .buttton2 {
    color: #fff;
    width: 114px;
    height: 40px;
    border-radius: 3px 3px 3px 3px;
    background: transparent !important;
    border: 1px solid #00ada3 !important;
  }

  .ant-modal-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff !important;
  }

  .ant-modal-footer {
    .ant-btn:nth-child(1) {
      color: #fff;
      width: 114px;
      height: 40px;
      border-radius: 3px 3px 3px 3px;
      background: transparent !important;
      border: 1px solid #00ada3 !important;
    }
  }
}

.bgs {
  .ant-modal-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff !important;
  }

  .ant-modal-footer {
    .ant-btn:nth-child(1) {
      color: #fff;
      width: 114px;
      height: 40px;
      border-radius: 3px 3px 3px 3px;
      background: transparent !important;
      border: 1px solid #00ada3 !important;
    }
  }
  .ant-btn {
    min-width: 114px;
    height: 40px;
    background: #00ada3;
    border-radius: 3px 3px 3px 3px;
  }

  .buttton2 {
    color: #fff;
    width: 114px;
    height: 40px;
    border-radius: 3px 3px 3px 3px;
    background: transparent !important;
    border: 1px solid #00ada3 !important;
  }
  .ant-input {
    width: 280px !important;
    height: 41px !important;
    background: rgba(31, 255, 242, 0.3) !important;
    border-radius: 3px 3px 3px 3px !important;
    border: 1px solid #1ffff2 !important;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #fff !important;
  }
}
.right-bottom {
  .ant-table-placeholder {
    background: RGBA(5, 60, 67, 1) !important;
    border-color: RGBA(5, 60, 67, 1) !important ;
  }
  .ant-empty-description {
    color: #fff;
  }
  th {
    background-color: #185f63 !important;
    color: #fff !important;
    border-color: #053c43 !important;
  }
  .ant-table-header {
    border-color: #053c43 !important;
    background-color: #185f63 !important;
  }
  .ant-table-column-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 16px;
    color: #ffffff;
  }
  td {
    border-color: #053c43 !important;
    color: #fff;
    background: #053c43 !important;
  }
}
.tiShiColor {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
}
.ant-tabs-tab {
  color: #fff;
}
.choZhiColor {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #1ffff2;
  cursor: pointer;
}
.tables {
  .ant-form-item-children {
    .ant-cascader-picker {
      background: transparent !important;
      line-height: 40px;
    }
    .ant-cascader-picker-label {
      color: rgba(255, 255, 255, 1);
    }
    .ant-input {
     
      background: rgba(31, 255, 242, 0.3) !important;
      border-radius: 3px 3px 3px 3px !important;
      border: 1px solid #1ffff2 !important;
      height: 35px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 1) !important;
    }
  }

  .ant-pagination-options-quick-jumper {
    color: rgba(31, 255, 242, 0.9) !important;
    line-height: 40px !important;
    input {
      margin: 0 10px !important;
      width: 38px !important;
      height: 25px !important;
      background: rgba(31, 255, 242, 0.12) !important;
      border-radius: 4px 4px 4px 4px !important;
      border: 1px solid rgba(31, 255, 242, 0.2) !important;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px !important;
      color: rgba(31, 255, 242, 0.9) !important;
    }
  }
  .ant-pagination-item-ellipsis {
    color: rgba(31, 255, 242, 0.9) !important;
  }

  .ant-form-item-control {
    line-height: 40px !important;
  }
  .ant-select-selection__rendered {
    line-height: 40px !important;
  }
  .ant-form-item-label {
    line-height: 40px !important;
  }
  .ant-form-item-label label {
  color: #FFFFFF !important;
}
.ant-menu-dark,
.ant-menu-dark .ant-menu-sub {
  color: rgba(255, 255, 255, 0.65);
  background: #006A77 !important;
}
  .ant-select-selection {
    background: rgba(31, 255, 242, 0.3) !important;
    border-radius: 3px 3px 3px 3px !important;
    border: 1px solid #1ffff2 !important;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.7) !important;
    margin: 0 !important;
    min-height: 41px !important;
  }
  .ant-pagination-total-text {
    position: absolute;
    left: 0;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px !important;
    color: #dbdbdb !important;
  }
  .ant-pagination-item-link {
    background: transparent !important;
    border: none !important;
    .anticon {
      color: #fff !important;
    }
  }
  .ant-pagination-item {
    background: rgba(31, 255, 242, 0.12) !important;
    border-radius: 4px 4px 4px 4px !important;
    border: 1px solid rgba(31, 255, 242, 0.2) !important;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px !important;
    color: rgba(31, 255, 242, 0.9) !important;
    a {
      color: rgba(31, 255, 242, 0.9) !important;
    }
  }
  .ant-pagination-item-active {
    a {
      color: #fff !important;
    }
  }
}
</style>