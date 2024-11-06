<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container p-5">
                <div class="modal-header">
                    <slot name="header">{{ title }}</slot>
                </div>

                <div class="container ">
                    <!-- update validation func later -->
                    <form class="row g-3 needs-validation " novalidate @submit.prevent="addLogs()">

                        <div class="col-12">
                            <label for="validationCustomUsername" class="form-label mt-4"></label>
                            <div class="input-group has-validation">
                                <span v-if="statNonEditable.length>0" class="input-group-text" id="inputGroupPrepend">{{ statNonEditable }}</span>
                                <input :type="statType" class="form-control text-center" id="validationCustomUsername"
                                    aria-describedby="inputGroupPrepend" placeholder="Enter pay" required
                                    :value="statEditable">
                                <div class="invalid-feedback">
                                    Please enter a valid number.
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="validationCustomUsername" class="form-label mt-4"></label>
                            <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend">{{ descriptionNonEditable
                                    }}</span>
                                <input :type="descType" class="form-control  text-center" id="validationCustomUsername"
                                    aria-describedby="inputGroupPrepend" placeholder="Enter pay" required
                                    :value="formatDate(descriptionEditable)">
                                <div class="invalid-feedback">
                                    Please enter a valid number.
                                </div>
                            </div>
                        </div>

                        <div class="col-12 ">
                            <br>
                            <hr>
                        </div>

                    </form>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-danger m-3" type="button" @click="$emit('close')">Cancel</button>
                    <!-- add addlogs fucntion here -->
                    <button class="btn btn-success" type="submit" @click="() => { $emit('close'); }">Add
                        log</button>
                </div>


            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
const { show, title, statNonEditable, statEditable, descriptionNonEditable, descriptionEditable } = defineProps({
    show: Boolean,
    title: String,
    statNonEditable: String,
    statEditable: [String, Number, Date],
    descriptionNonEditable: String,
    descriptionEditable: [String, Number, Date],
});


function formatDate(value) {
        if (typeof value === 'string' && value.indexOf('/')!=-1) {
        // Return the date in YYYY-MM-DD format
        const dateArray = value.split('/')
        return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    }else{
    return  value; // For String, Number, etc.

    }


    
}


const statType = ref('');
const descType = ref('');

function determineType(value) {

    if (typeof value === 'string' && value.indexOf('/')!=-1){
        return 'date';
    }else{
        return typeof value
    }



}

watch(() => [title, statNonEditable, statEditable, descriptionNonEditable, descriptionEditable], (newValues) => {
    console.log('this is modal');
    console.log('Updated tile props:', newValues);

    statType.value = determineType(statEditable);
    descType.value = determineType(descriptionEditable);

    console.log(statType.value);
    console.log(descType.value, newValues);
}, { immediate: true }); // Logs the values 







</script>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
    display: flex;
    transition: opacity 0.3s ease;
}

.modal-container {
    margin: auto;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}

.modal-header h3 {
    margin-top: 0;
}

.modal-default-button {
    float: right;
}

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(2);
}
</style>
