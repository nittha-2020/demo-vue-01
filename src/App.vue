<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawerRight" app clipped right>
      <v-row justify="space-around">
        <v-avatar size="250">
          <img :src="auser.avatar" :alt="auser.name" />
        </v-avatar>
      </v-row>
      <v-list>
        <v-list-item>
          <v-row v-if="user">
            <v-spacer />
            <center>
              <v-btn @click="logout">logout</v-btn>
            </center>
            <v-spacer />
          </v-row>
          <v-row v-else>
            <v-spacer />
            <center>
              <v-btn @click="login">login</v-btn>
            </center>
            <v-spacer />
          </v-row>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item @click.stop="right = !right">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Open Temporary Drawer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-right color="blue-grey" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item @click.stop="left = !left">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Open Temporary Drawer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="left" fixed temporary />

    <v-content>
      <v-container class="fill-height" fluid>
        <v-layout child-flex>
          <router-view />
        </v-layout>
      </v-container>
    </v-content>

    <v-navigation-drawer v-model="right" fixed right temporary />

    <v-footer app color="blue-grey" class="white--text">
      <span>Vuetify</span>
      <v-spacer />
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { msalMixin } from "vue-msal";
import axios from "axios";

export default {
  mixins: [msalMixin],
  props: {
    source: String
  },
  data: () => ({
    auser: {
      name: "",
      avatar:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
    },
    title: process.env.VUE_APP_TITLE,
    drawer: false,
    drawerRight: false,
    right: false,
    left: false
  }),
  methods: {
    init: function() {
      this.checklogin();
    },
    checklogin: function() {
      //console.log(this.msal.accessToken);
      if (this.msal.accessToken) {
        this.getuser();
      } else {
        // this.login();
      }
    },
    login: function() {
      console.log(process.env.VUE_APP_REDIRECT);
      this.$msal.signIn();
    },
    logout: async function() {
      localStorage.clear();
      this.$msal.signOut();
    },
    getuser: async function() {
      const instance = axios.create();
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.msal.accessToken}`;
      const graphEndpoint = "https://graph.microsoft.com/v1.0/me/photo/$value";
      // this.xinstance.responseType = "arraybuffer";
      let resp = await instance.get(graphEndpoint, {
        responseType: "arraybuffer"
      });
      const avatar = new Buffer(resp.data, "binary").toString("base64");
      this.auser.avatar = "data:image/png;base64, " + avatar;
      // console.log(avatar);
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    user() {
      let user = null;
      if (this.msal.isAuthenticated) {
        // Note that the dollar sign ($) is missing from this.msal
        user = {
          ...this.msal.user,
          profile: {}
        };
        if (this.msal.graph && this.msal.graph.profile) {
          user.profile = this.msal.graph.profile;
        }
      }
      if (this.msal.accessToken) {
        this.getuser();
      }
      return user;
    }
  }
};
</script>