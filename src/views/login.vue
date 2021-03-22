<template>
  <div style="position:relative;">
    <b-card class="mx-auto" style="max-width: 30rem; margin-top: 10rem;">
      <b-form-group label="Email" label-for="email">
        <b-form-input
          id="email"
          type="email"
          v-model="credentials.email"
          trim
        />
      </b-form-group>

      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="credentials.password"
          trim
        />
      </b-form-group>

      <b-button
        variant="primary"
        class="d-flex align-items-center"
        @click="handleLogin"
      >
        <b-spinner
          small
          class="align-middle mr-3"
          v-if="isSubmitting"
        ></b-spinner>
        <span>Login</span>
      </b-button>
    </b-card>
  </div>
</template>

<script>
import { $_login } from "@/services";
export default {
  name: "Login",
  data() {
    return {
      isSubmitting: false,
      credentials: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        this.isSubmitting = true;
        const { data } = await $_login(this.credentials);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        this.$router.push("/payment-history");
      } catch (err) {
        this.makeToast("danger", "Unauthorized", err.response.data.message);
      } finally {
        this.isSubmitting = false;
      }
    },

    makeToast(variant, title, message) {
      this.$bvToast.toast(message, {
        title,
        variant,
        solid: true,
      });
    },
  },
};
</script>

<style></style>
