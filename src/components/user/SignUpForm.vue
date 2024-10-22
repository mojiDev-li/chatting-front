<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-card class="pa-4 ma-14" title="Sign up">
        <v-card-item>
          <v-form ref="form" v-model="valid">
            <v-text-field :rules="rules.id" @blur="onBlur('id')" @focus="onfocus('id')" ref="idInput" v-model="id" label="ID"></v-text-field>
            <v-text-field
              ref="pwInput"
              v-model="pw"
              :rules="rules.pw"
              @blur="onBlur('pw')"
              @focus="onfocus('pw')"
              :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="visible ? 'text' : 'password'"
              label="PASSWORD"
              @click:append-inner="visible = !visible"
            ></v-text-field>
            <v-text-field
              ref="nameInput"
              :rules="rules.name"
              @blur="onBlur('name')"
              @focus="onfocus('name')"
              v-model="name"
              label="NAME"
            ></v-text-field>

            <div class="d-flex flex-column">
              <v-btn color="success" class="mt-4" block @click="onClickLogin"> Sign up </v-btn>
            </div>
            <div class="mt-3 d-flex flex-column">
              <v-btn variant="text" @click="onChangeSignIn"> Sign in <v-icon icon="mdi mdi-chevron-right"></v-icon></v-btn>
            </div>
          </v-form>
        </v-card-item>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { useSignStore } from "@/store/sign/sign"
import { mixedTypeAnnotation } from "@babel/types"
import { computed, onMounted, Ref, ref } from "vue"
import { useRouter } from "vue-router"
import { VTextField } from "vuetify/lib/components/index.mjs"

const emit = defineEmits(["changeStatus"])

const store = useSignStore()
const router = useRouter()

const idInput: Ref<VTextField | null> = ref(null)
const pwInput: Ref<VTextField | null> = ref(null)
const nameInput: Ref<VTextField | null> = ref(null)

const valid = ref()

const RULES_CONST: any = {
  id: [
    (value: string) => !!value || "Required.",
    (value: string) => {
      const pattern = /^[a-z]+[a-z0-9]{1,19}$/
      return pattern.test(value) || "영문자로 시작하는 영문자 또는 숫자 2~20자"
    }
  ],
  pw: [
    (value: string) => !!value || "Required.",
    (value: string) => {
      const pattern = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{1,16}$/
      return pattern.test(value) || "2~16자 영문, 숫자 조합"
    }
  ],
  name: [
    (value: string) => !!value || "Required.",
    (value: string) => {
      const pattern = /[ㄱ-힣0-9]{2,8}$/
      return pattern.test(value) || "2~8자 한글숫자"
    }
  ]
}

const rules: any = ref({
  id: [],
  pw: [],
  name: []
})

const onBlur = (key: string) => {
  rules.value[key] = RULES_CONST[key]
}

const onfocus = (key: string) => {
  rules.value[key] = []
}

const id = ref("")
const pw = ref("")
const name = ref("")

const visible = ref(false)

const onClickLogin = async () => {
  if (!valid.value) {
    alert("입력 양식이 잘못되었습니다.")
    idInput.value?.focus()
    return
  }
  try {
    await store.requestJoin({ userId: id.value, userPw: pw.value, name: name.value })
    alert("회원가입이 완료되었습니다. 로그인해주세요")
    onChangeSignIn()
  } catch (error: any) {
    if (error.code === "C007") {
      idInput.value?.focus()
    }
  }
}

const onChangeSignIn = () => {
  router.back()
}

onMounted(() => {
  idInput.value?.focus()
})
</script>
