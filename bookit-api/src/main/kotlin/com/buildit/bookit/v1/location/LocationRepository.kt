package com.buildit.bookit.v1.location

import com.buildit.bookit.v1.location.dto.Location

interface LocationRepository : org.springframework.data.repository.CrudRepository<Location, String>
