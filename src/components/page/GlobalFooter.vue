<template>
  <div class="footer">
    <div class="copyright">
      Copyright
      <a-icon type="copyright" />
      2022 <span>洛阳畅阳网络科技有限公司 出品</span>
    </div>

  </div>
</template>

<script>
export default {
  name: "LayoutFooter",
};
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 12px 0 12px;
  text-align: center;


  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: #fff;
    font-size: 14px;
  }
}
</style>

