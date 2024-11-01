<template>
 
    <div class="container">

    <!-- Header -->
        
    <h1 class="title row justify-content-center mt-5">{{ title }}</h1>
    <img class="carouselHeaderwidth col-12 mb-5" :src="Image">

    <!-- Event Details -->
    <div class="row">
        <div class="col-12 d-grid grid-template">
            <div class="event-details">
                {{details.time}}
            </div>

            <div class="event-details">
                {{details.location}}
            </div>

            <div class="event-details">
                {{details.price}}
            </div>
        </div>
    </div>

    <!-- Groups -->
    <!-- to display dynamically the list of created groups -->

    <!-- Event Cards -->
    <div class="my-5">
        <h2 class="title"> Related Events </h2>
        <div class="scroll-container">
            <!-- row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-5 -->
                <div class="card" style="width: 18rem;">
                    <img src="img/deepavali.png" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">Card title</h5>
                      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                      <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                  </div>

                  <div class="card" style="width: 18rem;">
                    <img src="img/deepavali.png" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">Card title</h5>
                      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                      <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                  </div>

                  <div class="card" style="width: 18rem;">
                    <img src="img/deepavali.png" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">Card title</h5>
                      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                      <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                  </div>

        </div>
    </div>

</div> <!-- for container -->

</template>

<script>

export default {
  data() {
    return {
      title: '',
      eventImage: '',
      description: '',
      details: [],
      eventCategory: '',
      groups: []
    };
  },
  created() {
    const eventId = this.$route.params.id;
    // Fetch or filter event data by `eventId`
    this.event = this.getEventById(eventId);
  },
  methods: {
    getEventById(id) {
      this.eventID = id;
    }
  }
}

</script>
