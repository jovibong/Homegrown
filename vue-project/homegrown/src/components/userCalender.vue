<template>
  <div>
    <!-- This button allows users to connect to Google Calendar without impacting their main login -->
    <button @click="requestCalendarAccess">Connect Google Calendar</button>

    <ul v-if="calendarEvents.length">
      <li v-for="event in calendarEvents" :key="event.id">
        <strong>{{ event.summary }}</strong>
        <p>{{ event.start.dateTime || event.start.date }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
const CLIENT_ID = '748881168394-maspb08ner814udj63b7fdieikgh2gev.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAiOMsPpvQqYh276xDd3wFxSRCg_Msf_6E';
import { gapi } from 'gapi-script';

export default {
  name: 'CalendarComponent',
  data() {
    return {
      calendarEvents: [],
    };
  },
  mounted() {
    this.initializeGapi();
  },
  methods: {
    initializeGapi() {
      gapi.load('client:auth2', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
          ],
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
        });
      });
    },

    // This method starts the OAuth consent only for calendar permissions
    async requestCalendarAccess() {
      try {
        await gapi.auth2.getAuthInstance().signIn();
        this.fetchCalendarEvents();
      } catch (error) {
        console.error('Error requesting calendar access', error);
      }
    },

    async fetchCalendarEvents() {
      try {
        const response = await gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: 'startTime',
        });
        this.calendarEvents = response.result.items;
      } catch (error) {
        console.error('Error fetching events', error);
      }
    },


    
  },
};

</script>

