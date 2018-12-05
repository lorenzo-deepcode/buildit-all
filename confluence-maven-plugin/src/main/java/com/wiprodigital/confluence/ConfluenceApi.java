package com.wiprodigital.confluence;

import com.wiprodigital.confluence.domain.Content;
import com.wiprodigital.confluence.domain.SearchContentResults;
import retrofit2.Call;
import retrofit2.http.*;

public interface ConfluenceApi {

    @GET("content")
    Call<SearchContentResults> search(
            @Query("spaceKey") String spaceKey,
            @Query("title") String title,
            @Query("expand") String expand);

    @POST("content")
    @Headers("Content-Type: application/json")
    Call<Content> create(@Body Content content);

    @PUT("content/{id}")
    @Headers("Content-Type: application/json")
    Call<Content> update(@Path("id") String id, @Body Content content);

}
