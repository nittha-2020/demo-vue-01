<template>
  <v-container>
    <v-data-table :headers="headers" :items="calendar" :items-per-page="5" class="elevation-1"></v-data-table>
  </v-container>
</template>
<script>
import { msalMixin } from "vue-msal";
import axios from "axios";
export default {
  mixins: [msalMixin],
  data: () => ({
    test: null,
    headers: [
      {
        text: "Subject",
        align: "start",
        sortable: false,
        value: "subject"
      },
      {
        text: "Body",
        align: "start",
        sortable: false,
        value: "subject"
      },
      {
        text: "Start",
        align: "start",
        sortable: true,
        value: "start.dateTime"
      },
      {
        text: "End",
        align: "start",
        sortable: false,
        value: "end.dateTime"
      },
      {
        text: "Hours",
        align: "start",
        sortable: false,
      },
      
      
    ],
    calendar: []
  }),
  methods: {
    getCalendar: async function() {
      const instance = axios.create();
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.msal.accessToken}`;
      instance.defaults.headers.common["Prefer"] = 'outlook.timezone="ICT"';
      instance.defaults.headers.common["Prefer"] =
        'outlook.body-content-type="text"';
      const graphEndpoint = "https://graph.microsoft.com/v1.0/me/events";
      //const params = new URLSearchParams();
      const now = new Date().toISOString().substr(0, 7);
      const start = new Date(now + "-01").toISOString();
      const end = new Date(now.substr(0, 4), now.substr(5, 2), 1).toISOString();
      let params =
        "?" +
        "startdatetime=" +
        start +
        "&enddatetime=" +
        end +
        "&$select=subject,start,end,body,bodyPreview" +
        "&$top=50&orderby=start/dateTime Asc";
      //console.log(end);
      //params.append("startdatetime", start);
      //params.append("enddatetime", end);
      //params.append("top", 2);
      console.log(graphEndpoint + params);
      let resp = await instance.get(graphEndpoint + params);
      this.calendar = resp.data.value;
      // console.log(resp.data.value);
    }
  },
  mounted() {
    this.getCalendar();
  }
};
</script>

