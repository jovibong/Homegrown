<template>
    <form @submit.prevent="submitInput">
        <div>
            <label for="title" class="form-label">Event Name</label>
            <input id="title" name="title" type="text" ref="titleInput" class="form-control" />
        </div>
    
        <div>
            <label for="description" class="form-label">Description</label>
            <input id="description" name="description" type="text" class="form-control" />
        </div>
    
        <div>
            <label for="time" class="form-label">Time</label>
            <input id="eventTime" name="eventTime" type="text" class="form-control" />
    
            <label for="location" class="form-label">Location</label>
            <input id="location" name="location" type="text" class="form-control" />
    
            <label for="price" class="form-label">Price</label>
            <input id="price" name="price" type="price" class="form-control" />
        </div>
    
        <div>
            <button @click="submitInput" class="btn btn-warning mt-2"> Submit </button>
        </div>
    </form>
    </template>
    
    <script>
    
    export default {
        // methods: {
        //     submitInput(){
        //         const eventTitle = this.$refs.titleInput.value;
    
        //          this.$router.push('/events/:id')
        //     }
        // }
    }
    </script>
    
    <style scoped>
    @import "../css/events.css";
    </style>
    