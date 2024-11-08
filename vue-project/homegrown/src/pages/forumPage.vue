<template>
    <div>
        <section class="container mx-auto text-center">
            <div>
                <h2 class="title">Community Forum</h2>
            </div>

            <div>
                <input type="text" class="searchBar" placeholder="Search something">
            </div>
        </section>

        <!-- Categories -->
        <section id="forumCategories" class="my-3">
            <div class="row d-flex justify-content-center">
                <div class="col-4">
                    <h2 class="title"> Popular Categories</h2>
                    <div class="d-flex flex-column mb-3">
                        <button class="p-2 category shadow-sm bg-body-tertiary">Flex item 1</button>
                        <button class="p-2 category shadow-sm bg-body-tertiary">Flex item 2</button>
                        <button class="p-2 category shadow-sm bg-body-tertiary">Flex item 3</button>
                    </div>
                </div>

                <div class="col-4">
                    <h2 class="title"> Top Discussions </h2>
                    <div class="d-flex flex-column mb-3">
                        <button class="p-2 discussion shadow-sm bg-body-tertiary">Flex item 1</button>
                        <button class="p-2 discussion shadow-sm bg-body-tertiary">Flex item 2</button>
                        <button class="p-2 discussion shadow-sm bg-body-tertiary">Flex item 3</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Forum  -->
        <section id="forum">
            <!-- Filter Buttons -->
            <div class="filter-buttons d-flex">
                <button :class="{ 'active': selectedCategory === 'all' }" @click="selectedCategory = 'all'">
                    All
                </button>

                <button :class="{ 'active': selectedCategory === 'top' }" @click="selectedCategory = 'top'">
                    <i class="bi bi-fire"></i>
                    Top
                </button>

                <button :class="{ 'active': selectedCategory === 'general' }" @click="selectedCategory = 'general'">
                    <i class="bi bi-chat-dots"></i>
                    General
                </button>

                <button :class="{ 'active': selectedCategory === 'learning' }" @click="selectedCategory = 'learning'">
                    <i class="bi bi-book"></i>
                    Learning
                </button>

                <button :class="{ 'active': selectedCategory === 'events' }" @click="selectedCategory = 'events'">
                    <i class="bi bi-calendar3"></i>
                    Events
                </button>

                <button type="button" class="createButton me-5" data-bs-toggle="modal" data-bs-target="#createForum">
                    POST
                </button>

                <!-- Modal -->
                <div class="modal fade" id="createForum" tabindex="-1" aria-labelledby="createForumLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-body">
                                <form @submit.prevent="addForum">

                                    <div class="row mb-3">
                                        <label for="title" class="col-sm-3 col-form-label"> Title : </label>
                                        <div class="col-sm-8">
                                            <input id="title" v-model="forumTitle" type="text" class="form-control" />
                                        </div>
                                    </div>

                                    <!-- Description -->
                                    <div class="row mb-3">
                                        <label for="description" class="col-sm-3 col-form-label">Description: </label>
                                        <div class="col-sm-8">
                                            <textarea rows="4" cols="50" id="description" v-model="forumDesc"
                                                class="form-control"></textarea>

                                        </div>
                                    </div>

                                    <!-- Forum Category -->
                                    <div class="row mb-3">
                                        <label for="forumCategory" class="col-sm-3 col-form-label">
                                            Category</label>
                                        <div class="col-sm-8">
                                            <select id="forumCategory" v-model="forumCategory" class="form-select">
                                                <option disabled value="">Select a category</option>
                                                <option value="general">General</option>
                                                <option value="learning">learning</option>
                                                <option value="events">events</option>
                                            </select>
                                        </div>
                                    </div>


                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" @click="addGroups" class="btn btn-primary">Create Group</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dynamic forum page-->
            <div>
                <div v-if="forums.length == 0">
                    No forums yet. Post your own!
                </div>
            </div>

            <!-- <router-link :to="{ name: 'forumDetail', params: { id: forumID }}" class="btn btn-primary">
        Go somewhere
      </router-link> -->
        </section>

    </div>

</template>

<script>

export default{
    data (){
        return {
            selectedCategory: "",
            forums: [],

            forumTitle: '',
            forumDesc:'',
            forumCategory:''
        }
    },

    methods: {
        async getAllForums (){

        },

        async getTopForums(){
            // Condition for top: comments >= 3
        },

        async getForumByCategory (selectedCategory) {
            console.log(selectedCategory)
        },

        async addForum(){

        }
    }

}
</script>
