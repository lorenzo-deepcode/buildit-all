using Xunit;
using FluentAssertions;
using TwigApi;
using Microsoft.AspNetCore.TestHost;
using System.Net.Http;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace TwigApi.Test
{
    public class TwigletsControllerTest
    {
        private readonly TestServer _server;
        private readonly HttpClient _client;

        public TwigletsControllerTest()
        {
            _server = new TestServer(new WebHostBuilder()
            .UseStartup<Startup>());
            _client = _server.CreateClient();
        }

        [Fact]
        public async void GetAllTwiglets()
        {
            // arrange
            // act
            var response = await _client.GetAsync("/twiglets");

            // assert
            response.EnsureSuccessStatusCode();
            var result = JsonConvert.DeserializeObject<IEnumerable<TwigletSummary>>(await response.Content.ReadAsStringAsync());
            result.Should().NotBeEmpty();
        }
    }
}