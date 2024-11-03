<script setup>
import Modal from './statsModal.vue'
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>

    <div>

        <div class="d-flex justify-content-start align-items-center mb-2">
            <span class="fw-bold ps-2">{{ title }}</span>
            <button class="interact p-2" id="show-modal" @click="showModal = true" >
                <i class='fas fa-edit'></i>
            </button>
            <Teleport to="body">
                <!-- use the modal component, pass in the prop -->
                <modal :show="showModal" @close="showModal = false" :title="title" :stat="stat" :description="description">
                    <template #header>
                        <h3>Custom Header</h3>
                    </template>
                </modal>
            </Teleport>
        </div>
        <div>
            <h1 class="text-center text-primary fw-bolder display-5 edit">{{ stat }}</h1>
        </div>
        <div>
            <p class="text-center text-muted edit">{{ description }}</p>
        </div>

    </div>

</template>

<script>

export default {
    props: ['title', 'stat', 'description']
} 
</script>

<style scoped>
/* try to flicker edit when hover over interact. prob is they are not siblings or child */
.interact {
    color: rgba(255, 207, 89, 1);
    transition: color 0.2s;
}

.interact:hover {
    color: red;
}

.interact:active {
    color: green;
}

button {
    background: transparent;
    border: none;
}



/* bento btn animation */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }
}

.bento-tile:hover .interact {

    animation: pulse 2s 3;

}

/* words edit animation */
@keyframes flicker {
    0% {
        opacity: 100%;
    }

    50% {
        opacity: 50%;
    }

    100% {
        opacity: 100%;
    }
}

.bento-tile:hover .edit {

    animation: flicker 2s 3;

}
</style>
