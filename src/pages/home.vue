<template>
  <div class="container-fluid">
    <div class="row justify-content-md-center">
      <div class="col-sm-12 col-md-8 col-lg-6">
        <form @submit.prevent="onSaveClicked">
          <div class="row">
            <div class="col-sm-12 col-md-6">
              <label for="firstnameInput" class="form-label">Firstname</label>
              <input
                type="text"
                class="form-control"
                :class="formErrors.firstname ? 'is-invalid' : ''"
                id="firstnameInput"
                v-model="formData.firstname"
                aria-describedby="firstnameInputFeedback"
              />
              <div id="firstnameInputFeedback" class="invalid-feedback">
                {{ formErrors.firstname }}
              </div>
            </div>

            <div class="col-sm-12 col-md-6">
              <label for="lastnameInput" class="form-label">Lastname</label>
              <input
                type="text"
                class="form-control"
                :class="formErrors.lastname ? 'is-invalid' : ''"
                id="lastnameInput"
                v-model="formData.lastname"
                aria-describedby="lastnameInputFeedback"
              />
              <div id="lastnameInputFeedback" class="invalid-feedback">
                {{ formErrors.lastname }}
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-12 col-md-6">
              <label for="genderSelect" class="form-label">Gender</label>
              <select
                id="genderSelect"
                class="form-select"
                v-model="formData.gender"
              >
                <option v-for="el in genders" :key="el" :value="el">
                  {{ el }}
                </option>
              </select>
            </div>

            <div class="col-sm-12 col-md-6">
              <label for="dobInput" class="form-label">Date of Birth</label>
              <input
                id="dobInput"
                class="form-control"
                type="date"
                v-model="formData.dob"
              />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label for="addressInput" class="form-label">Address</label>
              <input
                type="text"
                class="form-control"
                :class="formErrors.address ? 'is-invalid' : ''"
                id="addressInput"
                v-model="formData.address"
                aria-describedby="addressInputFeedback"
              />
              <div id="addressInputFeedback" class="invalid-feedback">
                {{ formErrors.address }}
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label for="notesTextarea" class="form-label">Notes</label>
              <textarea
                class="form-control"
                id="notesTextarea"
                rows="3"
                v-model="formData.notes"
              ></textarea>
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Save</button>
        </form>
      </div>
    </div>

    <div
      class="modal fade"
      id="notesModal"
      tabindex="-1"
      aria-labelledby="notesModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="notesModalLabel">Notes</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">{{ selectedNote }}</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover mt-3">
        <br />
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Firstname</th>
            <th scope="col">Lastname</th>
            <th scope="col">Address</th>
            <th scope="col">Date Of Birth</th>
            <th scope="col">Gender</th>
            <th scope="col"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="el in allUsers" :key="el.id" @click="onRowClicked(el)">
            <th scope="row" data-bs-toggle="modal" data-bs-target="#notesModal">
              {{ el.id }}
            </th>
            <td data-bs-toggle="modal" data-bs-target="#notesModal">
              {{ el.firstname }}
            </td>
            <td data-bs-toggle="modal" data-bs-target="#notesModal">
              {{ el.lastname }}
            </td>
            <td data-bs-toggle="modal" data-bs-target="#notesModal">
              {{ el.address }}
            </td>
            <td data-bs-toggle="modal" data-bs-target="#notesModal">
              {{ el.dob }}
            </td>
            <td data-bs-toggle="modal" data-bs-target="#notesModal">
              {{ el.gender }}
            </td>

            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="onUserRemoveClicked(el.id)"
              >
                X
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as db from '../db';

export default {
  data() {
    return {
      formData: {},
      formErrors: {},
      genders: ['male', 'female'],
      allUsers: [],
      selectedNote: '',
    };
  },
  methods: {
    validateForm() {
      this.formErrors = {};

      if (!this.formData.firstname) {
        this.formErrors.firstname = 'Firstname is required';
      }

      if (!this.formData.lastname) {
        this.formErrors.lastname = 'Lastname is required';
      }

      if (!this.formData.address) {
        this.formErrors.address = 'Address is required';
      }

      if (this.formData.address?.length > 35) {
        this.formErrors.address =
          'Address should be maximum 35 characters long';
      }

      return Object.keys(this.formErrors).length === 0;
    },
    async onSaveClicked() {
      if (!this.validateForm()) {
        return;
      }

      const record = db.insertUser(this.formData);
      this.formData = {};

      this.allUsers.push(record);
    },
    onUserRemoveClicked(id) {
      console.log(id);
      db.removeUser(id);
      this.allUsers.splice(
        this.allUsers.findIndex((u) => u.id === id),
        1
      );
    },
    onRowClicked(user) {
      this.selectedNote = user.notes;
    },
  },
  async mounted() {
    this.allUsers = db.fetchUsers();
  },
};
</script>

<style scoped></style>
