<template>
    
    <div class="card" style="width: 18rem;">

    <img :src="image" class="card-img-top" alt="">
    <div class="card-body">
    <h5 class="card-title">{{ title }}</h5>
    <p class="card-text"> {{ description }}</p>
    <router-link :to="{ name: 'eventDetail', params: { id: eventID }}" class="btn btn-primary">
        Go somewhere
        <!-- <i class="bi bi-arrow-right"></i> -->
        <i class="bi bi-arrow-right-circle"></i>
      </router-link>
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

   methods: {
   
   } 
}; 
</script>
