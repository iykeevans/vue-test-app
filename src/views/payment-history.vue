<template>
  <b-container class="pt-5">
    <div class="d-flex justify-content-end mb-5">
      <b-button @click="handleLogout">Log Out</b-button>
    </div>

    <b-row>
      <b-col sm="4">
        <div class="d-flex">
          <b-form-input
            trim
            placeholder="ANSSID Number..."
            v-model="identifier"
          />

          <b-button class="ml-2" variant="primary" @click="fetchPaymentHistory"
            >Search</b-button
          >
        </div>
      </b-col>
    </b-row>

    <b-table
      :items="items"
      :fields="fields"
      :busy="isBusy"
      class="mt-3"
      outlined
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>

      <template #cell(created_at)="row">
        {{ format(new Date(row.item.created_at), "MM/dd/yyyy h:mm a") }}
      </template>

      <template #cell(actions)="row">
        <b-button
          size="sm"
          @click="info(row.item, row.index, $event.target)"
          class="mr-1"
        >
          Edit
        </b-button>

        <b-button size="sm" @click="deletePaymentHistory(row.item)">
          Delete
        </b-button>
      </template>
    </b-table>

    <!-- Info modal -->
    <b-modal
      id="modal-prevent-closing"
      title="Update payment History"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="paymentHistoryData.customer_name"
            :state="nameState"
            required
          />
        </b-form-group>

        <b-form-group
          label="Bank"
          label-for="bank-input"
          invalid-feedback="Bank is required"
          :state="bankState"
        >
          <b-form-input
            id="bank-input"
            v-model="paymentHistoryData.bank_name"
            :state="bankState"
            required
          />
        </b-form-group>
      </form>
    </b-modal>
  </b-container>
</template>

<script>
import { format } from "date-fns";

import {
  $_getPaymentHistory,
  $_deletePaymentHistory,
  $_updatePaymentHistory,
} from "../services";
export default {
  name: "PaymentHistory",
  data() {
    return {
      isBusy: false,
      identifier: "",
      nameState: null,
      bankState: null,
      fields: [
        {
          key: "cust_Reference",
          label: "Anssid no",
          sortable: true,
        },
        {
          key: "customer_name",
          label: "Name",
          sortable: true,
        },
        {
          key: "amount",
          label: "Amount",
          sortable: true,
        },
        {
          key: "payment_reference",
          label: "Payment Ref",
          sortable: true,
        },
        {
          key: "bank_name",
          label: "Bank",
          sortable: true,
        },
        {
          key: "created_at",
          label: "Date",
          sortable: true,
        },
        { key: "actions", label: "Actions" },
      ],
      items: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      paymentHistoryData: {
        customer_name: "",
        bank_name: "",
      },
      selectedId: "",
    };
  },
  methods: {
    async fetchPaymentHistory() {
      try {
        this.isBusy = true;
        const { data: response } = await $_getPaymentHistory(this.identifier);
        this.items = response.data.data;
        this.makeToast("success", "Success", response.message);
      } catch (err) {
        this.makeToast("danger", "Error", err.response.data.message);
      } finally {
        this.isBusy = false;
      }
    },

    async deletePaymentHistory({ id }) {
      const originalItems = { ...this.items };

      try {
        this.items = this.items.filter((item) => item.id !== id);
        const { data } = await $_deletePaymentHistory(id);
        this.makeToast("success", "Success", data.message);
      } catch (err) {
        this.makeToast("danger", "Error", err.response.data.message);
        this.items = originalItems;
      }
    },

    async updatePaymentHistory() {
      const originalItems = { ...this.items };

      try {
        const index = this.items.findIndex(
          (item) => item.id === this.selectedId
        );
        this.items[index].bank_name = this.paymentHistoryData.bank_name;
        this.items[index].customer_name = this.paymentHistoryData.customer_name;

        const { data } = await $_updatePaymentHistory({
          ...this.paymentHistoryData,
          id: this.selectedId,
        });

        this.makeToast("success", "Success", data.message);
      } catch (err) {
        this.makeToast("danger", "Error", err.response.data.message);
        this.items = originalItems;
      }
    },

    info(item, index, button) {
      this.$root.$emit("bv::show::modal", "modal-prevent-closing", button);
      this.selectedId = item.id;
    },

    format,

    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.bankState = valid;
      return valid;
    },

    resetModal() {
      this.paymentHistoryData = {
        customer_name: "",
        bank_name: "",
      };
      this.selectedId = "";

      this.nameState = null;
      this.bankState = null;
    },

    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      // Trigger submit handler
      this.handleSubmit();
    },

    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }

      this.updatePaymentHistory();

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },

    handleLogout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      this.$router.push("/login");
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
