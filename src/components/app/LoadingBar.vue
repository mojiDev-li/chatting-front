<template>
  <v-container
    fluid
    style="
      z-index: 999;
      position: fixed;
      top: 0;
      left: 0;
      margin: 0px;
      padding: 0px;
      width: 100vw;
      height: 100%;
      background-color: rgba(60, 57, 52, 0.421);
    "
  >
    <v-responsive class="align-center text-center fill-height">
      <v-progress-circular color="primary" indeterminate :size="43"></v-progress-circular>
    </v-responsive>
  </v-container>
</template>
<script setup lang="ts"></script>
