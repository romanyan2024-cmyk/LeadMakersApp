package com.leadmakers.schedule.data

import kotlinx.serialization.Serializable

@Serializable
data class Profile(
    val id: String,
    val name: String,
    val phone: String,
    val role: String = "servant",
    val church_area: String? = null
)

@Serializable
data class WeeklyClass(
    val id: String? = null,
    val user_id: String,
    val class_number: Int,
    val day: String,
    val start_time: String,
    val end_time: String,
    val location: String,
    val notes: String? = null
)
