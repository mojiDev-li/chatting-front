<route lang="json">
{
  "path": "/:pathMatch(.*)*",
  "redirect": "/404",
  "meta": {
    "layout": false
  }
}
</route>

<template>
  <v-container class="fill-height">
    <v-responsive>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <div class="not-found">Whoops, 404</div>
        </v-col>
      </v-row>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <div class="">페이지를 찾을 수 없습니다.</div>
        </v-col>
      </v-row>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn @click="goUserList" variant="outlined"><v-icon icon="mdi mdi-arrow-left" size="large" start />홈 이동</v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import router from "@/router"

const goUserList = () => {
  router.replace("/userList")
}
</script>

<style lang="css" scoped>
.not-found {
  font-size: 40px;
  font-weight: 900;
  color: rgb(23, 23, 124);
}
</style>
