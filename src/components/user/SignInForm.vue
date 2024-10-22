<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-card class="pa-4 ma-14" title="Sign in">
        <v-card-item>
          <v-form ref="form">
            <v-text-field ref="idInput" v-model="id" label="ID"></v-text-field>
            <v-text-field
              v-model="pw"
              :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible ? 'text' : 'password'"
              label="PASSWORD"
              @click:append-inner="visible = !visible"
            ></v-text-field>
            <!-- <v-text-field v-model="name" :counter="10" label="NAME"></v-text-field> -->

            <div class="d-flex flex-column">
              <v-btn color="success" class="mt-4" block @click="onClickLogin"> Sign in </v-btn>
            </div>
            <div class="mt-3 d-flex flex-column">
              <v-btn variant="text" @click="onChangeSignUp"> Sign up <v-icon icon="mdi mdi-chevron-right"></v-icon></v-btn>
            </div>
          </v-form>
        </v-card-item>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { getAccessToken } from "@/axios/apiUtil"
import { useSignStore } from "@/store/sign/sign"
import { onMounted, Ref, ref } from "vue"
import { useRouter } from "vue-router"
import { VTextField } from "vuetify/lib/components/index.mjs"

const emit = defineEmits(["changeStatus"])

const idInput: Ref<VTextField | null> = ref(null)

const id = ref("")
const pw = ref("")

const visible = ref(false)

const store = useSignStore()
const router = useRouter()

const onClickLogin = async () => {
  try {
    await store.requestLogin({ userId: id.value, userPw: pw.value })
    router.replace({
      name: "/userList"
    })
  } catch (error: any) {
    console.log(error)
    if (error.code === "C002") {
      idInput.value?.focus()
    }
  }
}

const onChangeSignUp = () => {
  router.push({
    name: "/signUp"
  })
}

onMounted(() => {
  idInput.value?.focus()
})
</script>
