using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBrandEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_brands_category_id",
                table: "brands",
                column: "category_id");

            migrationBuilder.AddForeignKey(
                name: "fk_brands_categories_category_id",
                table: "brands",
                column: "category_id",
                principalTable: "categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_brands_categories_category_id",
                table: "brands");

            migrationBuilder.DropIndex(
                name: "ix_brands_category_id",
                table: "brands");
        }
    }
}
