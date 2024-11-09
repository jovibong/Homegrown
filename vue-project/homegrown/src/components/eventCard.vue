<template>
    
    <div class="card eventCard">

    <img :src="image" class="card-img-top" alt="">
    <div class="card-body d-flex flex-column">
    <h5 class="card-title text-center">{{ title }}</h5>
    <p class="card-text"> {{ croppedDescription }}</p>

    <div class="mt-auto text-center">
    <router-link :to="{ name: 'eventDetail', params: { id: eventID }}" class="btn btn-primary">
        Go somewhere
        <!-- <i class="bi bi-arrow-right"></i> -->
        <i class="bi bi-arrow-right-circle"></i>
    </router-link>
    </div>

    </div>

    </div>

</template>
 
<script>


export default {
    props: ['eventID', 'title', 'description', 'image'],

    data(){
        return{
            localTitle: this.title
        }
    },

   computed: {
    croppedDescription() {
      const maxLength = 50; // Max length for the description
      return this.description.length > maxLength
        ? this.description.slice(0, maxLength) + '...'  // Crop and append ellipsis
        : this.description;  // Return original description if it's short enough
    }
   } 
}; 
</script>

<style scoped>
@import '../css/events.css';

.eventCard {
  width: 200px;
  height: 320px;
  flex: 0 0 auto;
 }

</style>
