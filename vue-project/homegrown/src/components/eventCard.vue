<template>
    
    <div class="card" style="width: 18rem;">

    <img src="../img/deepavali.png" class="card-img-top" alt="">
    <div class="card-body">
    <h5 class="card-title">{{ title }}</h5>
    <p class="card-text"> {{ description }}</p>
    <router-link :to="{ name: 'eventDetail', params: { id: eventID }}" class="btn btn-primary">
        Go somewhere
      </router-link>
    </div>

    </div>

</template>
 
<script>

export default {
    props: 
    ['eventID', 'title', 'description', 'eventImage', 'eventLink']
} 
</script>
