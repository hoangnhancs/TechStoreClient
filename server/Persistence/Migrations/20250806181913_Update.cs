using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_user_action_trackings_product_id",
                table: "user_action_trackings",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_action_trackings_user_id",
                table: "user_action_trackings",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_product_vector_embeddings_product_id",
                table: "product_vector_embeddings",
                column: "product_id");

            migrationBuilder.AddForeignKey(
                name: "fk_product_vector_embeddings_products_product_id",
                table: "product_vector_embeddings",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_action_trackings_products_product_id",
                table: "user_action_trackings",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_action_trackings_users_user_id",
                table: "user_action_trackings",
                column: "user_id",
                principalTable: "AspNetUsers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_product_vector_embeddings_products_product_id",
                table: "product_vector_embeddings");

            migrationBuilder.DropForeignKey(
                name: "fk_user_action_trackings_products_product_id",
                table: "user_action_trackings");

            migrationBuilder.DropForeignKey(
                name: "fk_user_action_trackings_users_user_id",
                table: "user_action_trackings");

            migrationBuilder.DropIndex(
                name: "ix_user_action_trackings_product_id",
                table: "user_action_trackings");

            migrationBuilder.DropIndex(
                name: "ix_user_action_trackings_user_id",
                table: "user_action_trackings");

            migrationBuilder.DropIndex(
                name: "ix_product_vector_embeddings_product_id",
                table: "product_vector_embeddings");
        }
    }
}
